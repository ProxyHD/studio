export type Task = {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  project?: string;
  subtasks?: { id: string; title: string; done: boolean }[];
};

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export type Plan = {
  id: 'free' | 'plus' | 'pro';
  name: string;
  price: string;
  priceFrequency: string;
  features: string[];
  isCurrent?: boolean;
  cta: string;
  accent?: boolean;
};

export type Event = {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  description?: string;
};
