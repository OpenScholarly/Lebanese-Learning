export interface VocabularyWord {
  arabic: string;
  pronunciation: string;
  english: string;
  french: string;
}

export interface VocabularyCategory {
  name: string;
  name_arabic: string;
  words: VocabularyWord[];
}

export interface VocabularyData {
  [key: string]: VocabularyCategory;
}

export interface RadioStation {
  name: string;
  name_arabic: string;
  frequency: string;
  website?: string;
  genre: string;
  description: string;
  established?: number;
  special_programs?: string[];
}

export interface Podcast {
  name: string;
  name_arabic: string;
  host: string;
  platform: string;
  description: string;
  episodes?: number;
  rating?: number;
  focus_areas?: string[];
}

export interface TVShow {
  name: string;
  name_arabic: string;
  channel: string;
  genre: string;
  description: string;
  years?: string;
  status?: string;
  cast?: string[];
}

export interface NewsChannel {
  name: string;
  name_arabic: string;
  website: string;
  type: string;
  description: string;
  youtube_channel?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface CultureTopic {
  title: string;
  title_arabic: string;
  description: string;
  cultural_significance: string;
  modern_relevance?: string;
  examples?: string[];
}

export interface CultureData {
  [key: string]: CultureTopic[];
}

export interface GrammarRule {
  title: string;
  title_arabic: string;
  explanation: string;
  examples: Array<{
    arabic: string;
    pronunciation: string;
    english: string;
  }>;
  usage_notes?: string;
}

export interface GrammarContent {
  [key: string]: GrammarRule;
}

export interface LearningChannel {
  name: string;
  platform: string;
  url: string;
  subscribers: string;
  description: string;
  content_type: string;
  update_frequency: string;
  level: string;
}

export interface TranslationService {
  name: string;
  website: string;
  type: string;
  supports_lebanese: boolean;
  description: string;
  pricing?: string;
  features?: string[];
}
