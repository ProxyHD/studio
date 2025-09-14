import type { Plan, Locale } from './types';

const plansData: Record<Locale, Plan[]> = {
  'pt-BR': [
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
      cta: 'Seu Plano Atual',
    },
    {
      id: 'plus',
      name: 'Plus',
      price: '€4,99',
      priceFrequency: '/mês',
      features: [
        'Tudo do plano Grátis',
        'Projetos e sub-tarefas',
        'Temas e cores personalizadas',
        'Backups automáticos',
        'Armazenamento aumentado',
      ],
      cta: 'Upgrade para Plus',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '€9,99',
      priceFrequency: '/mês',
      features: [
        'Tudo do plano Plus',
        'Assistente de IA',
        'Localização e convidados em eventos',
        'Suporte prioritário',
        '10 GB de armazenamento',
      ],
      cta: 'Upgrade para Pro',
      accent: true,
    },
  ],
  'en-US': [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      priceFrequency: 'forever',
      features: [
        'Basic tasks',
        'Simple calendar',
        'Basic notes',
        'Basic finances',
        'Limited storage',
      ],
      cta: 'Current Plan',
    },
    {
      id: 'plus',
      name: 'Plus',
      price: '$5.99',
      priceFrequency: '/month',
      features: [
        'Everything in Free',
        'Projects and sub-tasks',
        'Custom themes and colors',
        'Automatic backups',
        'Increased storage',
      ],
      cta: 'Upgrade to Plus',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$11.99',
      priceFrequency: '/month',
      features: [
        'Everything in Plus',
        'AI assistant',
        'Event location and guests',
        'Priority support',
        '10 GB storage',
      ],
      cta: 'Upgrade to Pro',
      accent: true,
    },
  ]
};

export const getPlans = (locale: Locale): Plan[] => {
  return plansData[locale];
};
