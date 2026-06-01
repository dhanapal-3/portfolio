export const PROFILE = {
  name: 'Dhanapal Selvam',
  role: 'Full Stack Developer | AI Systems Builder',
  location: 'Tamil Nadu, India',
  tagline:
    'Building intelligent systems from enterprise apps to AI-powered automation',
  company: 'vThink Global Technologies Pvt Ltd',
} as const;

export const ACHIEVEMENTS = [
  {
    title: 'Smart India Hackathon 2023',
    detail: 'Finalist',
    icon: 'trophy',
  },
  {
    title: 'Newbie Ninja Award',
    detail: 'Company recognition for impact',
    icon: 'star',
  },
  {
    title: 'Rapid growth & delivery',
    detail: 'High-impact features across the stack',
    icon: 'rocket',
  },
] as const;

export const SKILLS = {
  frontend: ['Angular', 'HTML', 'CSS', 'TypeScript'],
  backend: ['Node.js', 'Express', 'Sequelize', 'PostgreSQL', 'MySQL'],
  ai: [
    'LangChain',
    'LangGraph',
    'Groq',
    'Claude',
    'Prompt Engineering',
  ],
  tools: [
    'Pinecone',
    'Milvus',
    'Redis',
    'n8n',
    'PostHog',
    'Puppeteer',
  ],
} as const;

export const PROJECTS = [
  {
    name: 'Nexus',
    subtitle: 'AI Platform',
    description:
      'AI-powered real estate automation system with an email → AI → action pipeline.',
    highlights: [
      'Email AI automation',
      'Human-in-the-loop',
      'Streaming AI responses',
      'Presentation generator',
    ],
    gradient: 'from-cyan-500/20 via-fuchsia-500/15 to-violet-500/20',
    accent: 'cyan',
  },
  {
    name: 'Synergy',
    subtitle: 'Housing Booking Platform',
    description:
      'Short-term stay booking with multi-client onboarding and property workflows.',
    highlights: [
      '16 landing pages',
      'Property listing & booking',
      'Multi-tenant flows',
    ],
    gradient: 'from-violet-500/20 via-rose-500/10 to-cyan-500/15',
    accent: 'violet',
  },
  {
    name: 'VTA',
    subtitle: 'Talent Acquisition Platform',
    description:
      'End-to-end recruitment: candidate lifecycle, jobs, and hiring tracking.',
    highlights: [
      'Candidate lifecycle',
      'Job & workflow tracking',
      'Hiring pipeline',
    ],
    gradient: 'from-fuchsia-500/15 via-cyan-500/10 to-emerald-500/15',
    accent: 'fuchsia',
  },
  {
    name: 'Vbuddy',
    subtitle: 'Chat Application',
    description:
      'Real-time enterprise chat for internal communication at scale.',
    highlights: ['Real-time messaging', 'Enterprise-ready', 'Team channels'],
    gradient: 'from-emerald-500/15 via-cyan-500/15 to-violet-500/10',
    accent: 'emerald',
  },
  {
    name: 'KRA',
    subtitle: 'Feedback System',
    description:
      'Employee performance tracking with structured feedback and reporting.',
    highlights: ['Performance cycles', 'Feedback flows', 'Reporting'],
    gradient: 'from-rose-500/15 via-violet-500/15 to-cyan-500/10',
    accent: 'rose',
  },
] as const;

export const EXPERIENCE = {
  company: PROFILE.company,
  bullets: [
    'Built multiple enterprise applications end-to-end.',
    'Developed AI-powered platforms with LangChain & modern LLM tooling.',
    'Integrated third-party APIs across complex workflows.',
    'Full stack delivery with Angular + Node.js.',
  ],
} as const;

/** Update with your public contact links before deploy */
export const CONTACT = {
  email: 'dhanapaldeveloper@gmail.com',
  linkedin: 'https://www.linkedin.com/in/dhanapal-selvam',
} as const;
