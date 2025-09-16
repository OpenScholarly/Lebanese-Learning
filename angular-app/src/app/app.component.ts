import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface VocabularyWord {
  arabic: string;
  english: string;
  french?: string;
  pronunciation: string;
  category: string;
  difficulty: string;
  usage?: string;
  example?: string;
}

interface VocabularyCategory {
  id: string;
  name: string;
  icon: string;
  words: VocabularyWord[];
}

interface RadioStation {
  name: string;
  name_arabic: string;
  frequency: string;
  website?: string;
  genre: string;
  description: string;
  established?: number;
  special_programs?: string[];
}

interface Podcast {
  name: string;
  host?: string;
  rating?: number;
  language: string;
  level: string;
  format: string;
  description: string;
  platforms: string[];
  since?: string;
}

interface TVShow {
  name: string;
  name_arabic?: string;
  genre: string;
  year?: number;
  description: string;
  learning_focus?: string[];
  difficulty_level?: string;
  episodes?: number;
}

interface CulturalTradition {
  name: string;
  name_arabic: string;
  description: string;
  origin?: string;
  occasions?: string[];
  elements?: string[];
  customs?: string[];
}

interface NewsChannel {
  name: string;
  name_arabic: string;
  website: string;
  description: string;
  type: string;
  language: string;
  focus?: string[];
}

interface GrammarTopic {
  topic: string;
  topic_arabic: string;
  difficulty: string;
  description: string;
  examples: Array<{
    english: string;
    arabic: string;
    pronunciation: string;
    usage_note?: string;
  }>;
}

interface UserProfile {
  xp: number;
  level: string;
  streakDays: number;
  wordsLearned: number;
  masteredWords: number;
  totalWords: number;
}

interface AppStats {
  vocabularyWords: number;
  radioStations: number;
  podcasts: number;
  culturalTraditions: number;
}

interface LearningPath {
  greetings: { mastered: number; total: number; status: string };
  slang: { mastered: number; total: number; status: string };
  grammar: { mastered: number; total: number; status: string };
  culture: { mastered: number; total: number; status: string };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lebanese-learning-app';
  
  // UI State
  activeSection = 'dashboard';
  sidebarOpen = false;
  darkMode = false;
  cardFlipped = false;
  
  // Search and filters
  globalSearchTerm = '';
  vocabularySearchTerm = '';
  difficultyFilter = 'all';
  learningMode = 'flashcard';
  
  // User data
  userProfile: UserProfile = {
    xp: 450,
    level: 'Intermediate',
    streakDays: 12,
    wordsLearned: 65,
    masteredWords: 65,
    totalWords: 130
  };
  
  // App statistics
  stats: AppStats = {
    vocabularyWords: 130,
    radioStations: 8,
    podcasts: 6,
    culturalTraditions: 4
  };
  
  // Challenge data
  challengeProgress = 60;
  challengeCompleted = 3;
  challengeTotal = 5;
  
  // Learning path
  learningPath: LearningPath = {
    greetings: { mastered: 18, total: 18, status: 'completed' },
    slang: { mastered: 12, total: 20, status: 'current' },
    grammar: { mastered: 0, total: 15, status: 'Not started' },
    culture: { mastered: 0, total: 10, status: 'Locked' }
  };
  
  // Vocabulary data
  vocabularyCategories: VocabularyCategory[] = [];
  currentWord: VocabularyWord | null = null;
  selectedCategory = 'greetings_basic';
  currentCardIndex = 0;
  totalCards = 0;
  
  // Radio stations data
  radioStations: RadioStation[] = [];
  
  // Podcasts data
  podcasts: Podcast[] = [];
  
  // TV Shows data
  tvShows: TVShow[] = [];
  
  // Culture data
  culturalTraditions: CulturalTradition[] = [];
  
  // News channels data
  newsChannels: NewsChannel[] = [];
  
  // Grammar data
  grammarTopics: GrammarTopic[] = [];
  selectedGrammarTopic: GrammarTopic | null = null;
  
  // Translation data
  translationInput = '';
  translationOutput = '';
  translationDirection = 'en-ar'; // en-ar or ar-en
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.loadVocabularyData();
    this.loadRadioStations();
    this.loadPodcasts();
    this.loadTVShows();
    this.loadCultureData();
    this.loadNewsChannels();
    this.loadGrammarTopics();
    this.initializeApp();
  }
  
  // Initialize app
  initializeApp() {
    this.setActiveSection('dashboard');
    this.loadUserPreferences();
  }
  
  // Load vocabulary data from JSON files
  async loadVocabularyData() {
    try {
      const response = await this.http.get<any>('/assets/expanded_vocabulary.json').toPromise();
      if (response) {
        this.vocabularyCategories = this.transformVocabularyData(response);
        this.selectCategory(this.selectedCategory);
      }
    } catch (error) {
      console.error('Error loading vocabulary data:', error);
      // Fallback data
      this.loadFallbackVocabulary();
    }
  }
  
  // Transform JSON data to component format
  transformVocabularyData(data: any): VocabularyCategory[] {
    const categories: VocabularyCategory[] = [];
    
    Object.keys(data).forEach(key => {
      const categoryData = data[key];
      if (categoryData && categoryData.words) {
        categories.push({
          id: key,
          name: categoryData.name || key.replace(/_/g, ' '),
          icon: categoryData.icon || '📚',
          words: categoryData.words || []
        });
      }
    });
    
    return categories;
  }
  
  // Load fallback vocabulary data
  loadFallbackVocabulary() {
    this.vocabularyCategories = [
      {
        id: 'greetings_basic',
        name: 'Basic Greetings',
        icon: '👋',
        words: [
          {
            arabic: 'أهلاً وسهلاً',
            english: 'hello/welcome',
            french: 'bonjour/bienvenue',
            pronunciation: 'ahlan wa sahlan',
            category: 'greetings_basic',
            difficulty: 'beginner',
            usage: 'Formal greeting'
          },
          {
            arabic: 'مرحبا',
            english: 'hello',
            french: 'salut',
            pronunciation: 'marhaba',
            category: 'greetings_basic',
            difficulty: 'beginner'
          }
        ]
      }
    ];
    this.selectCategory('greetings_basic');
  }
  
  // Load radio stations data
  async loadRadioStations() {
    try {
      const response = await this.http.get<RadioStation[]>('/assets/lebanese_radio_stations.json').toPromise();
      if (response) {
        this.radioStations = response;
      }
    } catch (error) {
      console.error('Error loading radio stations:', error);
    }
  }
  
  // Load podcasts data
  async loadPodcasts() {
    try {
      const response = await this.http.get<Podcast[]>('/assets/lebanese_podcasts.json').toPromise();
      if (response) {
        this.podcasts = response;
      }
    } catch (error) {
      console.error('Error loading podcasts:', error);
    }
  }
  
  // Load TV shows data
  async loadTVShows() {
    try {
      const response = await this.http.get<TVShow[]>('/assets/lebanese_tv_shows.json').toPromise();
      if (response) {
        this.tvShows = response;
      }
    } catch (error) {
      console.error('Error loading TV shows:', error);
    }
  }
  
  // Load culture data
  async loadCultureData() {
    try {
      const response = await this.http.get<{traditions: CulturalTradition[]}>('/assets/lebanese_culture.json').toPromise();
      if (response && response.traditions) {
        this.culturalTraditions = response.traditions;
      }
    } catch (error) {
      console.error('Error loading culture data:', error);
    }
  }
  
  // Load news channels data
  async loadNewsChannels() {
    try {
      const response = await this.http.get<NewsChannel[]>('/assets/expanded_news_channels.json').toPromise();
      if (response) {
        this.newsChannels = response;
      }
    } catch (error) {
      console.error('Error loading news channels:', error);
    }
  }
  
  // Load grammar topics data
  async loadGrammarTopics() {
    try {
      const response = await this.http.get<any>('/assets/grammar_content.json').toPromise();
      if (response && typeof response === 'object') {
        this.grammarTopics = Object.keys(response).map(key => {
          return { name: key, ...response[key] };
        });
        if (this.grammarTopics.length > 0) {
          this.selectedGrammarTopic = this.grammarTopics[0];
        }
      }
    } catch (error) {
      console.error('Error loading grammar topics:', error);
    }
  }
  
  // UI Methods
  setActiveSection(section: string) {
    this.activeSection = section;
    this.sidebarOpen = false;
  }
  
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    console.log('Sidebar open:', this.sidebarOpen);
  }
  
  closeSidebar() {
    this.sidebarOpen = false;
  }
  
  toggleTheme() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
  }
  
  // Search functionality
  performGlobalSearch() {
    console.log('Global search:', this.globalSearchTerm);
    // Implement global search logic
  }
  
  filterVocabulary() {
    console.log('Filter vocabulary:', this.vocabularySearchTerm, this.difficultyFilter);
    // Implement vocabulary filtering logic
  }
  
  // Challenge methods
  startChallenge(section: string, category: string) {
    this.setActiveSection(section);
    if (section === 'vocabulary') {
      this.selectCategory(category);
    }
  }
  
  // Learning path methods
  getPathStepClass(step: string): string {
    const stepData = this.learningPath[step as keyof LearningPath];
    if (stepData.status === 'completed') return 'completed';
    if (stepData.status === 'current') return 'current';
    return 'upcoming';
  }
  
  // Vocabulary methods
  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    const category = this.vocabularyCategories.find(c => c.id === categoryId);
    if (category && category.words.length > 0) {
      this.currentWord = category.words[0];
      this.currentCardIndex = 0;
      this.totalCards = category.words.length;
      this.cardFlipped = false;
    }
  }
  
  getCurrentCategory(): VocabularyCategory | undefined {
    return this.vocabularyCategories.find(c => c.id === this.selectedCategory);
  }
  
  flipCard() {
    this.cardFlipped = !this.cardFlipped;
  }
  
  previousCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.updateCurrentWord();
    }
  }
  
  nextCard() {
    if (this.currentCardIndex < this.totalCards - 1) {
      this.currentCardIndex++;
      this.updateCurrentWord();
    }
  }
  
  updateCurrentWord() {
    const category = this.getCurrentCategory();
    if (category && category.words[this.currentCardIndex]) {
      this.currentWord = category.words[this.currentCardIndex];
      this.cardFlipped = false;
    }
  }
  
  changeLearningMode() {
    console.log('Learning mode changed to:', this.learningMode);
    // Implement learning mode logic
  }
  
  // Audio methods
  playAudio(event: Event, text: string) {
    event.stopPropagation();
    console.log('Playing audio for:', text);
    // Implement TTS audio playback
    this.speakText(text, false);
  }
  
  playSlowAudio(event: Event, text: string) {
    event.stopPropagation();
    console.log('Playing slow audio for:', text);
    // Implement slow TTS audio playback
    this.speakText(text, true);
  }
  
  private speakText(text: string, slow: boolean = false) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-LB'; // Lebanese Arabic
      utterance.rate = slow ? 0.7 : 1;
      speechSynthesis.speak(utterance);
    }
  }
  
  // Mastery methods
  markDifficulty(event: Event, difficulty: string) {
    event.stopPropagation();
    console.log('Marked difficulty:', difficulty, 'for word:', this.currentWord?.arabic);
    // Implement difficulty tracking
    
    // Auto-advance to next card after marking
    setTimeout(() => {
      if (this.currentCardIndex < this.totalCards - 1) {
        this.nextCard();
      }
    }, 500);
  }
  
  // User preferences
  loadUserPreferences() {
    const savedPrefs = localStorage.getItem('lebaneseLearningPrefs');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      this.darkMode = prefs.darkMode || false;
      this.learningMode = prefs.learningMode || 'flashcard';
      document.body.classList.toggle('dark-mode', this.darkMode);
    }
  }
  
  saveUserPreferences() {
    const prefs = {
      darkMode: this.darkMode,
      learningMode: this.learningMode,
      selectedCategory: this.selectedCategory
    };
    localStorage.setItem('lebaneseLearningPrefs', JSON.stringify(prefs));
  }
  
  // Grammar methods
  selectGrammarTopic(topic: GrammarTopic) {
    this.selectedGrammarTopic = topic;
  }
  
  // Translation methods
  // Basic translation mapping for demonstration purposes
  private translationMap: { [key: string]: { 'en-ar'?: string, 'ar-en'?: string } } = {
    'hello': { 'en-ar': 'مرحبا', 'ar-en': 'hello' },
    'goodbye': { 'en-ar': 'وداعا', 'ar-en': 'goodbye' },
    'thank you': { 'en-ar': 'شكرا', 'ar-en': 'thank you' },
    'yes': { 'en-ar': 'نعم', 'ar-en': 'yes' },
    'no': { 'en-ar': 'لا', 'ar-en': 'no' },
    'مرحبا': { 'ar-en': 'hello', 'en-ar': 'مرحبا' },
    'وداعا': { 'ar-en': 'goodbye', 'en-ar': 'وداعا' },
    'شكرا': { 'ar-en': 'thank you', 'en-ar': 'شكرا' },
    'نعم': { 'ar-en': 'yes', 'en-ar': 'نعم' },
    'لا': { 'ar-en': 'no', 'en-ar': 'لا' }
  };

  translateText() {
    // Basic translation using a small mapping. In a real app, use a translation API.
    const input = this.translationInput.trim().toLowerCase();
    if (input) {
      const mapping = this.translationMap[input];
      if (
        mapping &&
        mapping[this.translationDirection as 'en-ar' | 'ar-en']
      ) {
        this.translationOutput = mapping[this.translationDirection as 'en-ar' | 'ar-en']!;
      } else {
        this.translationOutput = 'Translation not available for this phrase.';
      }
    } else {
      this.translationOutput = '';
    }
  }
  
  swapTranslationDirection() {
    this.translationDirection = this.translationDirection === 'en-ar' ? 'ar-en' : 'en-ar';
    this.translationInput = '';
    this.translationOutput = '';
  }
  
  playTranslationAudio(text: string) {
    this.speakText(text);
  }
}