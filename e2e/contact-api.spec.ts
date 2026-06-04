import { expect, test } from '@playwright/test';

const mailApiBase = `http://127.0.0.1:${process.env.MAIL_API_PORT || '4301'}`;

const validPayload = {
  name: 'Test User',
  email: 'tester@example.com',
  subject: 'Playwright inquiry',
  message: 'This is an automated end-to-end test message.',
};

test.describe('Contact API', () => {
  test('health endpoint responds', async ({ request }) => {
    const response = await request.get(`${mailApiBase}/api/health`);
    expect(response.status()).toBeGreaterThanOrEqual(200);
    const body = await response.json();
    expect(body).toHaveProperty('ok');
  });

  test('rejects honeypot submissions', async ({ request }) => {
    const response = await request.post(`${mailApiBase}/api/contact`, {
      data: { ...validPayload, website: 'https://spam.example' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe('Invalid request.');
  });

  test('rejects invalid email', async ({ request }) => {
    const response = await request.post(`${mailApiBase}/api/contact`, {
      data: { ...validPayload, email: 'not-an-email' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe('Invalid email address.');
  });

  test('strips control characters from subject', async ({ request }) => {
    const response = await request.post(`${mailApiBase}/api/contact`, {
      data: { ...validPayload, subject: 'Bad\r\nSubject' },
    });
    expect([400, 500]).toContain(response.status());
    const body = await response.json();
    expect(body.ok).toBe(false);
  });

  test('rate limits repeated submissions', async ({ request }) => {
    let saw429 = false;
    for (let i = 0; i < 12; i += 1) {
      const response = await request.post(`${mailApiBase}/api/contact`, {
        data: validPayload,
        headers: { 'X-Forwarded-For': 'playwright-rate-limit' },
      });
      if (response.status() === 429) {
        saw429 = true;
        const body = await response.json();
        expect(body.error).toMatch(/too many requests/i);
        break;
      }
    }
    expect(saw429).toBe(true);
  });
});
