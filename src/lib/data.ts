import type { Task, Note, Plan } from './types';

export const tasks: Task[] = [
  { id: '1', title: 'Finalize Q3 report', status: 'in-progress', priority: 'high', dueDate: '2024-08-15' },
  { id: '2', title: 'Design new landing page', status: 'todo', priority: 'medium', dueDate: '2024-08-20' },
  { id: '3', title: 'Fix login bug', status: 'done', priority: 'high', dueDate: '2024-08-10' },
  { id: '4', title: 'Schedule team meeting', status: 'todo', priority: 'low', dueDate: '2024-08-12' },
  { id: '5', title: 'Update documentation', status: 'in-progress', priority: 'medium' },
];

export const notes: Note[] = [
    {
        id: '1',
        title: 'Project Phoenix Ideas',
        content: 'Initial thoughts on Project Phoenix. We should focus on a mobile-first approach. Key features: user authentication, real-time data sync, and offline support. Consider using React Native or Flutter for cross-platform compatibility.',
        createdAt: '2024-08-01',
    },
    {
        id: '2',
        title: 'Meeting with Marketing',
        content: 'Q3 marketing strategy discussion. Key takeaways: increase social media presence on Twitter and LinkedIn. Launch a new ad campaign focusing on our new AI features. Budget allocated: $20,000.',
        createdAt: '2024-07-28',
    },
    {
        id: '3',
        title: 'Grocery List',
        content: '- Milk\n- Bread\n- Eggs\n- Cheese\n- Apples\n- Bananas',
        createdAt: '2024-08-05',
    }
];

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
    priceFrequency: 'para sempre',
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
    price: '€3.99',
    priceFrequency: '/mês',
    features: [
      'Everything in Free',
      'Export to CSV/PDF',
      'Automatic backups',
      'Premium themes',
      'Advanced notifications',
    ],
    cta: 'Upgrade to Plus',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€7.99',
    priceFrequency: '/mês',
    features: [
      'Everything in Plus',
      'AI Assistant',
      'Chat & collaboration',
      'Unlimited multi-device',
      '10 GB storage',
    ],
    cta: 'Upgrade to Pro',
    accent: true,
  },
];
