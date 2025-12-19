
export interface Option {
  label: string; // "A", "B", etc.
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  correctAnswer: string; // "A", "B", etc.
}

export interface Passage {
  id: number;
  title: string;
  headline: string;
  content: string;
  questions: Question[];
  practiceModule?: PracticeModule;
}

export interface ExamState {
  currentPassageIndex: number;
  answers: Record<number, string>; // questionId -> selectedOptionLabel
  flagged: Set<number>; // questionIds that are flagged for review
  isSubmitted: boolean;
  timeRemaining: number; // in seconds
}

export interface TimelineEvent {
  year: string;
  label: string;
  description?: string;
}

export interface DragDropItem {
  id: string;
  content: string;
  category?: string; // For sorting tasks
}

export interface DragDropTask {
  instruction: string;
  items: DragDropItem[];
  targets: { id: string; label: string; expectedIds: string[] }[]; // Buckets
}

export interface SentenceBuilderTask {
  instruction: string;
  sentenceParts: string[]; // "The", "cat", "sat"
  correctOrder: string[];
}

export interface PracticeModule {
  grammarTopic: string;
  mfp: {
    meaning: string;
    form: string;
    pronunciation: string;
    timeline?: TimelineEvent[]; // NEW: For tenses/evolution
  };
  // Micro-chunks replaced generic teaching chunks
  microLessons: {
    type: 'CONCEPT' | 'TIMELINE' | 'DRAG_DROP' | 'SENTENCE_BUILDER' | 'QUIZ' | 'SPEAKING';
    title: string;
    content?: string; // For Concept
    data?: any; // Dynamic data based on type
    xpReward: number;
  }[];
}
