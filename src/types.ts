export type ViewMode = 
  | 'home'
  | 'welcome'
  | 'layer-1'
  | 'lesson-1-1'
  | 'lesson-1-2';

export interface Lesson {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  content: string[];
  keyTakeaway: string;
  focusConcepts: {
    term: string;
    explanation: string;
  }[];
}

export interface Layer {
  id: string;
  number: number;
  title: string;
  description: string;
  learningPoints: string[];
  lessons: Lesson[];
}

export interface Platform {
  id: string;
  name: string;
  subtitle: string;
  status: 'active' | 'upcoming';
  badgeText?: string;
  description: string;
}
