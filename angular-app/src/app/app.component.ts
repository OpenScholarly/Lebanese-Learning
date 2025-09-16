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
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.loadVocabularyData();
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
}