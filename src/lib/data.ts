import type { Task, Note, Plan, Event } from './types';

export const tasks: Task[] = [];

export const notes: Note[] = [];

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
export const events: Event[] = [];
