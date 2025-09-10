import type { Locale } from './types';

const translations: Record<string, Record<Locale, string>> = {
  // General
  'Dashboard': { 'pt-BR': 'Painel', 'en-US': 'Dashboard' },
  'Tasks': { 'pt-BR': 'Tarefas', 'en-US': 'Tasks' },
  'Calendar': { 'pt-BR': 'Calendário', 'en-US': 'Calendar' },
  'Well-being': { 'pt-BR': 'Bem-estar', 'en-US': 'Well-being' },
  'Notes': { 'pt-BR': 'Notas', 'en-US': 'Notes' },
  'Settings': { 'pt-BR': 'Configurações', 'en-US': 'Settings' },
  'Upgrade to Pro': { 'pt-BR': 'Upgrade para Pro', 'en-US': 'Upgrade to Pro' },
  'Logout': { 'pt-BR': 'Sair', 'en-US': 'Logout' },
  'N/A': { 'pt-BR': 'N/D', 'en-US': 'N/A' },
  'days': { 'pt-BR': 'dias', 'en-US': 'days' },

  // Dashboard
  'Completed Tasks': { 'pt-BR': 'Tarefas Concluídas', 'en-US': 'Completed Tasks' },
  'Current Mood': { 'pt-BR': 'Humor Atual', 'en-US': 'Current Mood' },
  'Expenses': { 'pt-BR': 'Despesas', 'en-US': 'Expenses' },
  'Habit Streak': { 'pt-BR': 'Sequência de Hábitos', 'en-US': 'Habit Streak' },

  // Upgrade Page
  'Plans & Pricing': { 'pt-BR': 'Planos e Preços', 'en-US': 'Plans & Pricing' },
  'Find the Perfect Plan': { 'pt-BR': 'Encontre o Plano Perfeito', 'en-US': 'Find the Perfect Plan' },
  'Unlock your potential with LifeHub. Choose the plan that best suits your life and goals.': { 
    'pt-BR': 'Desbloqueie seu potencial com o LifeHub. Escolha o plano que melhor se adapta à sua vida e aos seus objetivos.', 
    'en-US': 'Unlock your potential with LifeHub. Choose the plan that best suits your life and goals.' 
  },
  'Most Popular': { 'pt-BR': 'Mais Popular', 'en-US': 'Most Popular' },

  // Add other translations here
};

export const t = (key: string, locale: Locale): string => {
  return translations[key]?.[locale] || key;
};
