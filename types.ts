export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
}

export enum Difficulty {
  EASY = '简单',
  MEDIUM = '中等',
  HARD = '困难',
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  bibleReference: string; // e.g., "出埃及记 3:14"
  explanation: string;
}

export interface GameSession {
  score: number;
  currentQuestionIndex: number;
  streak: number;
  lives: number;
  difficulty: Difficulty;
  questions: Question[];
  userAnswers: { questionId: string; isCorrect: boolean }[];
}