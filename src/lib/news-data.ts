import type { NewsItem, Locale } from './types';

const newsData: Record<Locale, NewsItem[]> = {
  'pt-BR': [
    {
      id: 'ai-assistant-launch',
      title: 'Apresentando o Assistente de IA!',
      content: 'Estamos entusiasmados em lançar nosso novo Assistente de IA! Agora você pode obter sugestões de rotina personalizadas, criar tarefas e notas usando linguagem natural e muito mais. Este é um grande passo para tornar o LifeHub seu centro de produtividade pessoal definitivo. Atualize para o plano Pro para começar a usar a IA hoje!',
      imageUrl: 'https://picsum.photos/seed/1/600/400',
      imageHint: 'artificial intelligence robot',
    },
    {
      id: 'new-wellbeing-features',
      title: 'Novos Recursos de Bem-Estar',
      content: 'Sua saúde mental é importante. É por isso que adicionamos um novo rastreador de humor e um sistema aprimorado de acompanhamento de hábitos. Acompanhe como você se sente ao longo do tempo e construa hábitos positivos com nossas novas ferramentas. Disponível para todos os usuários!',
      imageUrl: 'https://picsum.photos/seed/2/600/400',
      imageHint: 'meditation yoga',
    },
    {
      id: 'custom-themes-plus',
      title: 'Temas Personalizados para Usuários Plus',
      content: 'Expresse-se com novas paletas de cores e temas! Usuários Plus agora podem personalizar a aparência do aplicativo para combinar com seu estilo. Vá para Configurações -> Aparência para experimentar as novas opções. Queremos que o LifeHub pareça realmente seu.',
      imageUrl: 'https://picsum.photos/seed/3/600/400',
      imageHint: 'color palette',
    },
  ],
  'en-US': [
    {
      id: 'ai-assistant-launch',
      title: 'Introducing the AI Assistant!',
      content: 'We are thrilled to launch our new AI Assistant! You can now get personalized routine suggestions, create tasks and notes using natural language, and much more. This is a huge step in making LifeHub your ultimate personal productivity hub. Upgrade to the Pro plan to start using AI today!',
      imageUrl: 'https://picsum.photos/seed/1/600/400',
      imageHint: 'artificial intelligence robot',
    },
    {
      id: 'new-wellbeing-features',
      title: 'New Well-being Features',
      content: 'Your mental health matters. That\'s why we\'ve added a new mood tracker and an enhanced habit tracking system. Keep track of how you feel over time and build positive habits with our new tools. Available for all users!',
      imageUrl: 'https://picsum.photos/seed/2/600/400',
      imageHint: 'meditation yoga',
    },
    {
      id: 'custom-themes-plus',
      title: 'Custom Themes for Plus Users',
      content: 'Express yourself with new color palettes and themes! Plus users can now customize the look and feel of the app to match their style. Head over to Settings -> Appearance to try out the new options. We want LifeHub to feel like it\'s truly yours.',
      imageUrl: 'https://picsum.photos/seed/3/600/400',
      imageHint: 'color palette',
    },
  ],
};

export const getNews = (locale: Locale): NewsItem[] => {
  return newsData[locale];
};
