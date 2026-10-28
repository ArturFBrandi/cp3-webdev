import { courseLinks } from '@/content/shared'
import type { Content } from '@/types/content'

export const content: Content = {
  profile: {
    role: 'Engenheiro de Software Backend',
    lede: 'Construo plataformas de integração escaláveis com NestJS, TypeScript e AWS, e exploro sistemas de IA multiagente e desenvolvimento de jogos independentes nas horas vagas. Moro em São Paulo e estou aberto a trabalho remoto, híbrido e presencial.',
    location: 'São Paulo, Brasil',
    availability: 'Aberto a trabalho remoto, híbrido e presencial',
  },
  skills: [
    { title: 'Linguagens', items: 'TypeScript, JavaScript, Python, C#' },
    { title: 'Frameworks', items: 'NestJS, Node.js, FastAPI, Next.js, .NET Framework' },
    {
      title: 'Cloud e infraestrutura',
      items: 'AWS (Lambda, ECS, EC2, S3, IAM, Glue, Athena, CloudWatch), Docker, CircleCI',
    },
    { title: 'Bancos de dados', items: 'PostgreSQL, MongoDB, Redis' },
    { title: 'Testes', items: 'Jest, Playwright — unitários, de integração e end-to-end' },
    {
      title: 'Forma de trabalho',
      items: 'Desenvolvimento orientado a especificação com Claude Code',
    },
  ],
  experience: [
    {
      title: 'Engenheiro de Software Backend — RWS',
      start: '2023-02',
      end: null,
      bullets: [
        'Desenvolvo e mantenho APIs RESTful escaláveis com NestJS e TypeScript.',
        'Projeto comunicação segura entre serviços com OAuth2 e chaves de API.',
        'Construo pipelines de ETL e scripts de automação em Python na AWS.',
        'Implemento pipelines de CI/CD com CircleCI e testes automatizados.',
        'Desenvolvo e mantenho suítes de testes end-to-end com Playwright.',
        'Aplico desenvolvimento orientado a especificação — estruturando requisitos e critérios de aceite antes da implementação, para entregas previsíveis e rastreáveis.',
      ],
      achievements: [
        {
          title: 'Plataforma de monitoramento de integrações',
          description:
            'reduziu o tempo de monitoramento manual de ~2 horas para 5 minutos (redução de 90%) com automação e alertas proativos.',
        },
        {
          title: 'Integração de pré-pedidos Hortifruti Natural da Terra x iFood',
          description:
            'desenvolvi a integração backend do fluxo de pré-pedidos do iFood, reduzindo tempo e custo operacional e simplificando a conciliação financeira.',
        },
      ],
    },
    {
      title: 'Bacharelado em Engenharia de Software — FIAP',
      start: '2026-01',
      end: '2029-12',
      bullets: [],
      achievements: [],
      note: {
        text: 'Cursos relevantes estudados por conta própria: Stanford Engineering Everywhere —',
        links: courseLinks,
      },
    },
  ],
  inDevelopment: [
    {
      name: 'Farmoria',
      status: 'Repositório privado · em desenvolvimento',
      tags: ['Unity', 'C#', 'Dev solo', 'Game design', 'Gestão de projeto'],
      description:
        'Um jogo independente. O jogador naufraga e vai parar numa fazenda abandonada, tomada por monstros e isolada do resto da ilha pelos moradores. O ciclo principal: limpar a fazenda, reconstruí-la, fazer amizade com os moradores, descer até uma caverna e derrotar o que espera lá no fundo — com plantio, criação de animais, mineração, pesca e NPCs marcantes pelo caminho. Desenvolvido sozinho em Unity, com um processo orientado a especificação para cada funcionalidade.',
      linkNote: 'Repositório ainda não é público',
    },
  ],
}
