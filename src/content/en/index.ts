import { courseLinks } from '@/content/shared'
import type { Content } from '@/types/content'

export const content: Content = {
  profile: {
    role: 'Backend Software Engineer',
    lede: 'I build scalable integration platforms with NestJS, TypeScript, and AWS, and explore multi-agent AI systems and indie game development on the side. Based in São Paulo, Brazil, open to remote, hybrid, and on-site work.',
    location: 'São Paulo, Brazil',
    availability: 'Open to remote, hybrid, and on-site work',
  },
  skills: [
    { title: 'Languages', items: 'TypeScript, JavaScript, Python, C#' },
    { title: 'Frameworks', items: 'NestJS, Node.js, FastAPI, Next.js, .NET Framework' },
    {
      title: 'Cloud & infra',
      items: 'AWS (Lambda, ECS, EC2, S3, IAM, Glue, Athena, CloudWatch), Docker, CircleCI',
    },
    { title: 'Databases', items: 'PostgreSQL, MongoDB, Redis' },
    { title: 'Testing', items: 'Jest, Playwright — unit, integration, and end-to-end' },
    { title: 'Ways of working', items: 'Spec-driven development with Claude Code' },
  ],
  experience: [
    {
      title: 'Backend Software Engineer — RWS',
      start: '2023-02',
      end: null,
      bullets: [
        'Build and maintain scalable RESTful APIs using NestJS and TypeScript.',
        'Design secure service-to-service communication using OAuth2 and API keys.',
        'Build ETL pipelines and automation scripts in Python on AWS.',
        'Implement CI/CD pipelines with CircleCI and automated testing.',
        'Build and maintain end-to-end test suites with Playwright.',
        'Apply spec-driven development — structuring requirements and acceptance criteria before implementation for predictable, traceable delivery.',
      ],
      achievements: [
        {
          title: 'Integration monitoring platform',
          description:
            'cut manual monitoring time from ~2 hours to 5 minutes (a 90% reduction) through automation and proactive alerting.',
        },
        {
          title: 'Hortifruti Natural da Terra x iFood pre-order integration',
          description:
            "built the backend integration for iFood's pre-order flow, reducing operational time and cost and simplifying financial reconciliation.",
        },
      ],
    },
    {
      title: 'B.Sc. Software Engineering — FIAP',
      start: '2026-01',
      end: '2029-12',
      bullets: [],
      achievements: [],
      note: {
        text: 'Relevant self-study coursework: Stanford Engineering Everywhere —',
        links: courseLinks,
      },
    },
  ],
  inDevelopment: [
    {
      name: 'Farmoria',
      status: 'Private repository · in development',
      tags: ['Unity', 'C#', 'Solo dev', 'Game design', 'Project management'],
      description:
        "An indie game. The player shipwrecks on an island and washes up on an abandoned farm that's been overrun by monsters and sealed off from the rest of the island by the locals. The core loop: clear the farm, build it back up, befriend the islanders, descend into a cave, and take down what's waiting at the bottom — with farming, livestock, mining, fishing, and rich NPCs along the way. Built solo in Unity, with a spec-driven development process for every feature.",
      linkNote: 'Repository not public yet',
    },
  ],
}
