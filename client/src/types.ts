export interface Question {
  id: string;
  question: string;
  answer: boolean;
  explanation: string;
}

export type InputType = 'text' | 'url' | 'pdf' | 'youtube';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GenerateQuestionsResponse {
  questions: Question[];
  sourceType: string;
  error?: string;
}
