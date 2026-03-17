export interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  currentCard: number;
  settings: Settings;
  stats: Stats;
  selectedCategory: string;
  learningMode: string;
  currentGrammarTopic: string|null;
  savedTranslations: Translation[];
  translationHistory: Translation[];
}

export interface Stats {
  wordsLearned: number;
  masteredWords: number;
  difficultWords: number;
  totalWords: number;
  dailyGoal: number;
  streakDays: number;
  studyTime: number; // in minutes
  achievements: Achievement[];
}

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Settings {
  proficiency: ProficiencyLevel;
  audioEnabled: boolean;
  slowAudioEnabled: boolean;
  autoPlayEnabled: boolean;
  dailyReminders: boolean;
  streakReminders: boolean;
  achievementNotifications: boolean;
}


export interface Achievement {
  id: string;
  name?: string;
  description?: string;
  dateEarned?: Date;
}


export interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  date: Date;
}

export interface VoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
  default: boolean;
  localService: boolean;
}
