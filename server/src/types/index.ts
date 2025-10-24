export interface Question {
  id: string;
  question: string;
  answer: boolean;
  explanation: string;
}

export interface GenerateQuestionsRequest {
  content: string;
  numberOfQuestions?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface GenerateQuestionsResponse {
  questions: Question[];
  sourceType: string;
  error?: string;
}

export interface ContentExtractionResult {
  content: string;
  title?: string;
  error?: string;
}
