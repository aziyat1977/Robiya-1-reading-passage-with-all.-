
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

export interface PracticeModule {
  grammarTopic: string;
  mfp: {
    meaning: string;
    form: string;
    pronunciation: string;
    visualData: { label: string; value: number }[]; // For timeline/charts
  };
  examples: string[];
  quizzes: { question: string; options: string[]; correct: number }[];
  tests: { question: string; options: string[]; correct: number }[];
  gapFills: { sentence: string; answer: string }[];
  kahootLinks: { title: string; url: string }[];
  speakingQuestions: string[];
}
