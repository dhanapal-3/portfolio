require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const port = Number(process.env.MAIL_API_PORT || 4301);
const app = express();
app.disable('x-powered-by');

const allowedOrigins = new Set(
  [process.env.FRONTEND_ORIGIN, 'http://localhost:4200', 'http://127.0.0.1:4200'].filter(
    Boolean
  )
);

function isDev() {
  return process.env.NODE_ENV !== 'production';
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        if (isDev()) {
          callback(null, true);
          return;
        }
        callback(new Error('Origin header required'));
        return;
      }
      if (allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Blocked by CORS: ${origin}`));
    },
  })
);
app.use(express.json({ limit: '32kb' }));

const REQUIRED_ENV = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'CONTACT_TARGET_EMAIL',
];

const MIN_NAME_LENGTH = 2;
const MIN_SUBJECT_LENGTH = 4;
const MIN_MESSAGE_LENGTH = 15;
const CONTACT_RATE_LIMIT = 8;
const CONTACT_RATE_WINDOW_MS = 15 * 60 * 1000;
const HONEYPOT_FIELD = 'website';

const contactAttempts = new Map();

function stripCrLf(value) {
  return String(value ?? '').replaceAll(/[\r\n]/g, '');
}

function stripControlChars(value) {
  return String(value ?? '')
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      return code < 32 ? ' ' : char;
    })
    .join('');
}

function envValue(key) {
  return stripCrLf(process.env[key]);
}

function missingEnv() {
  return REQUIRED_ENV.filter((key) => !envValue(key));
}

function clientKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function pruneRateLimits(now = Date.now()) {
  for (const [key, entry] of contactAttempts) {
    if (now >= entry.resetAt) {
      contactAttempts.delete(key);
    }
  }
}

function isRateLimited(key) {
  pruneRateLimits();
  const now = Date.now();
  const entry = contactAttempts.get(key);
  if (!entry || now >= entry.resetAt) {
    contactAttempts.set(key, { count: 1, resetAt: now + CONTACT_RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > CONTACT_RATE_LIMIT;
}

function normalize(value, max) {
  return String(value ?? '')
    .replaceAll('\r\n', '\n')
    .trim()
    .slice(0, max);
}

function isEmail(value) {
  const at = value.indexOf('@');
  if (at <= 0 || at === value.length - 1) {
    return false;
  }
  const domain = value.slice(at + 1);
  const dot = domain.lastIndexOf('.');
  return dot > 0 && dot < domain.length - 1 && !domain.includes(' ');
}

function isHoneypotTriggered(body) {
  const trap = normalize(body?.[HONEYPOT_FIELD], 200);
  return trap.length > 0;
}

function validate(body) {
  const name = stripControlChars(normalize(body.name, 100)).trim();
  const email = normalize(body.email, 200).toLowerCase();
  const subject = stripControlChars(normalize(body.subject, 160)).trim();
  const message = normalize(body.message, 2000);

  if (name.length < MIN_NAME_LENGTH) {
    return { ok: false, error: 'Invalid name.' };
  }
  if (!isEmail(email)) {
    return { ok: false, error: 'Invalid email address.' };
  }
  if (subject.length < MIN_SUBJECT_LENGTH) {
    return { ok: false, error: 'Invalid subject.' };
  }
  if (message.length < MIN_MESSAGE_LENGTH) {
    return { ok: false, error: 'Message is too short.' };
  }

  return { ok: true, data: { name, email, subject, message } };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function createTransporter() {
  const smtpPort = Number(envValue('SMTP_PORT'));
  if (!Number.isInteger(smtpPort) || smtpPort <= 0 || smtpPort > 65535) {
    throw new Error('Invalid SMTP_PORT.');
  }

  return nodemailer.createTransport({
    host: envValue('SMTP_HOST'),
    port: smtpPort,
    secure: envValue('SMTP_SECURE').toLowerCase() === 'true',
    auth: {
      user: envValue('SMTP_USER'),
      pass: envValue('SMTP_PASS'),
    },
  });
}

app.get('/api/ping', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/health', (_req, res) => {
  const missing = missingEnv();
  if (missing.length) {
    const payload = { ok: false };
    if (isDev()) {
      payload.missing = missing;
    }
    res.status(500).json(payload);
    return;
  }
  res.json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  if (isRateLimited(clientKey(req))) {
    res.status(429).json({ ok: false, error: 'Too many requests. Try again later.' });
    return;
  }

  if (isHoneypotTriggered(req.body)) {
    res.status(400).json({ ok: false, error: 'Invalid request.' });
    return;
  }

  const result = validate(req.body || {});
  if (!result.ok) {
    res.status(400).json({ ok: false, error: result.error });
    return;
  }

  const missing = missingEnv();
  if (missing.length) {
    res.status(500).json({ ok: false, error: 'Mailer is not configured.' });
    return;
  }

  const { name, email, subject, message } = result.data;
  const fromAddress = envValue('SMTP_FROM') || envValue('SMTP_USER');

  try {
    await createTransporter().sendMail({
      from: `"Portfolio" <${fromAddress}>`,
      to: envValue('CONTACT_TARGET_EMAIL'),
      replyTo: email,
      subject: `Portfolio inquiry: ${subject}`,
      text: [`Name: ${name}`, `Email: ${email}`, `Subject: ${subject}`, '', message].join('\n'),
      html: [
        `<p><b>Name:</b> ${escapeHtml(name)}</p>`,
        `<p><b>Email:</b> ${escapeHtml(email)}</p>`,
        `<p><b>Subject:</b> ${escapeHtml(subject)}</p>`,
        `<p>${escapeHtml(message).replaceAll('\n', '<br>')}</p>`,
      ].join(''),
    });
    res.json({ ok: true });
  } catch (error) {
    console.error('Contact API:', error);
    const payload = { ok: false, error: 'Failed to send email.' };
    if (isDev() && error instanceof Error) {
      payload.details = error.message;
    }
    res.status(500).json(payload);
  }
});

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Mail API http://localhost:${port}`);
  });
}
