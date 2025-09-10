import type { Task, Note, Plan, Event } from './types';

export const tasks: Task[] = [];

export const notes: Note[] = [
    {
        id: '1',
        title: 'Ideias para o Projeto Phoenix',
        content: 'Pensamentos iniciais sobre o Projeto Phoenix. Devemos focar em uma abordagem mobile-first. Funcionalidades principais: autenticação de usuário, sincronização de dados em tempo real e suporte offline. Considerar o uso de React Native ou Flutter para compatibilidade multiplataforma.',
        createdAt: '2024-08-01',
    },
    {
        id: '2',
        title: 'Reunião com Marketing',
        content: 'Discussão da estratégia de marketing do 3º trimestre. Principais pontos: aumentar a presença nas redes sociais no Twitter e LinkedIn. Lançar uma nova campanha publicitária focada em nossos novos recursos de IA. Orçamento alocado: €20.000.',
        createdAt: '2024-07-28',
    },
    {
        id: '3',
        title: 'Lista de Compras',
        content: '- Leite\n- Pão\n- Ovos\n- Queijo\n- Maçãs\n- Bananas',
        createdAt: '2024-08-05',
    }
];

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Grátis',
    price: '€0',
    priceFrequency: 'para sempre',
    features: [
      'Tarefas básicas',
      'Calendário simples',
      'Notas básicas',
      'Finanças básicas',
      'Armazenamento limitado',
    ],
    isCurrent: true,
    cta: 'Plano Atual',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '€3.99',
    priceFrequency: '/mês',
    features: [
      'Tudo do plano Grátis',
      'Exportar para CSV/PDF',
      'Backups automáticos',
      'Temas premium',
      'Notificações avançadas',
    ],
    cta: 'Upgrade para Plus',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€7.99',
    priceFrequency: '/mês',
    features: [
      'Tudo do plano Plus',
      'Assistente de IA',
      'Chat e colaboração',
      'Multi-dispositivo ilimitado',
      '10 GB de armazenamento',
    ],
    cta: 'Upgrade para Pro',
    accent: true,
  },
];

const today = new Date();
export const events: Event[] = [
  {
    id: '1',
    title: 'Reunião de equipe',
    date: today,
    startTime: '10:00',
    endTime: '11:00',
    description: 'Reunião semanal de alinhamento.'
  },
  {
    id: '2',
    title: 'Consulta Médica',
    date: today,
    startTime: '14:30',
    description: 'Check-up anual.'
  },
   {
    id: '3',
    title: 'Apresentação do Projeto',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
    startTime: '09:00',
    endTime: '12:00',
  }
];
