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
      isCurrent: true,
      cta: 'Plano Atual',
    },
    {
      id: 'plus',
      name: 'Plus',
      price: '€4.99',
      priceFrequency: '/mês',
      features: [
        'Tudo do plano Grátis',
        'Exportar para CSV/PDF',
        'Backups automáticos',
        'Temas premium',
        'Notificações avançadas',
        'Armazenamento aumentado',
      ],
      cta: 'Upgrade para Plus',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '€9.99',
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
      isCurrent: true,
      cta: 'Current Plan',
    },
    {
      id: 'plus',
      name: 'Plus',
      price: '$5.99',
      priceFrequency: '/month',
      features: [
        'Everything in Free',
        'Export to CSV/PDF',
        'Automatic backups',
        'Premium themes',
        'Advanced notifications',
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
        'Chat and collaboration',
        'Unlimited multi-device',
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
