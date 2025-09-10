import type { Task, Note, Plan } from './types';

export const tasks: Task[] = [
  { id: '1', title: 'Finalizar relatório do 3º trimestre', status: 'in-progress', priority: 'high', dueDate: '2024-08-15' },
  { id: '2', title: 'Projetar nova página inicial', status: 'todo', priority: 'medium', dueDate: '2024-08-20' },
  { id: '3', title: 'Corrigir bug de login', status: 'done', priority: 'high', dueDate: '2024-08-10' },
  { id: '4', title: 'Agendar reunião de equipe', status: 'todo', priority: 'low', dueDate: '2024-08-12' },
  { id: '5', title: 'Atualizar documentação', status: 'in-progress', priority: 'medium' },
];

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
