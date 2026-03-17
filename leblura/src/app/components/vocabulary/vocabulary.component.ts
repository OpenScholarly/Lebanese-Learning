import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { VocabularyStore } from '../../stores/vocabulary.store';
import { AppStore } from '../../stores/app.store';
import { VocabularyData, VocabularyCategory, VocabularyWord } from '../../interfaces/LearningData';
import { User } from '../../interfaces/User';

@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.scss']
})
export class VocabularyComponent implements OnInit, OnDestroy {
  vocabularyData: VocabularyData = {};
  vocabularyCategories: VocabularyCategory[] = [];
  filteredCategories: VocabularyCategory[] = [];
  currentCategory: VocabularyCategory | null = null;
  currentWord: VocabularyWord | null = null;
  currentUser: User | null = null;

  searchTerm: string = '';
  selectedDifficulty: string = 'all';
  learningMode: string = 'flashcard';
  currentCardIndex: number = 0;
  isCardFlipped: boolean = false;

  loading: boolean = false;
  error: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private vocabularyStore: VocabularyStore,
    private appStore: AppStore
  ) {}

  ngOnInit() {
    // Subscribe to vocabulary data
    this.subscriptions.push(
      this.vocabularyStore.vocabularyData$.subscribe(data => {
        this.vocabularyData = data;
        this.vocabularyCategories = Object.values(data);
        console.log('Loaded vocabulary categories:', this.vocabularyCategories);
        this.filteredCategories = this.vocabularyCategories;

        if (this.vocabularyCategories.length > 0 && !this.currentCategory) {
          this.selectCategory(this.vocabularyCategories[0]);
        }
      })
    );

    // Subscribe to loading state
    this.subscriptions.push(
      this.vocabularyStore.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );

    // Subscribe to error state
    this.subscriptions.push(
      this.vocabularyStore.error$.subscribe(error => {
        this.error = error;
      })
    );

    // Subscribe to current user
    this.subscriptions.push(
      this.appStore.currentUser.subscribe(user => {
        this.currentUser = user || null;
        if (user && user.selectedCategory) {
          const category = this.vocabularyCategories.find(cat =>
            Object.keys(this.vocabularyData).find(key => key === user.selectedCategory)
          );
          if (category) {
            this.selectCategory(category);
          }
        }
      })
    );

    // Load vocabulary data
    this.vocabularyStore.loadVocabularyData().subscribe();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectCategory(category: VocabularyCategory) {
    this.currentCategory = category;
    this.currentCardIndex = this.currentUser?.currentCard || 0;
    this.updateCurrentWord();
    this.isCardFlipped = false;
  }

  updateCurrentWord() {
    if (this.currentCategory && this.currentCategory.words.length > 0) {
      this.currentWord = this.currentCategory.words[this.currentCardIndex] || this.currentCategory.words[0];
    }
  }

  nextCard() {
    if (!this.currentCategory) return;

    this.currentCardIndex = (this.currentCardIndex + 1) % this.currentCategory.words.length;
    this.updateCurrentWord();
    this.isCardFlipped = false;

    // Update user progress
    if (this.currentUser) {
      this.appStore.updateUser({ currentCard: this.currentCardIndex });
    }
  }

  prevCard() {
    if (!this.currentCategory) return;

    this.currentCardIndex = this.currentCardIndex > 0
      ? this.currentCardIndex - 1
      : this.currentCategory.words?.length - 1;
    this.updateCurrentWord();
    this.isCardFlipped = false;

    // Update user progress
    if (this.currentUser) {
      this.appStore.updateUser({ currentCard: this.currentCardIndex });
    }
  }

  flipCard() {
    this.isCardFlipped = !this.isCardFlipped;
  }

  playAudio(slow: boolean = false) {
    if (this.currentWord && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(this.currentWord.arabic);
      utterance.lang = 'ar-SA';
      utterance.rate = slow ? 0.6 : 0.8;
      speechSynthesis.speak(utterance);
    }
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.filterVocabulary();
  }

  onDifficultyChange(event: any) {
    this.selectedDifficulty = event.target.value;
    this.filterVocabulary();
  }

  onLearningModeChange(event: any) {
    this.learningMode = event.target.value;
    if (this.currentUser) {
      this.appStore.updateUser({ learningMode: this.learningMode });
    }
  }

  private filterVocabulary() {
    if (this.searchTerm) {
      this.vocabularyStore.searchVocabulary(this.searchTerm).subscribe(filtered => {
        this.filteredCategories = filtered;
      });
    } else {
      this.filteredCategories = this.vocabularyCategories;
    }
  }

  getCategoryKey(category: VocabularyCategory): string {
    return Object.keys(this.vocabularyData).find(key =>
      this.vocabularyData[key] === category
    ) || '';
  }

  getProgressPercentage(): number {
    if (!this.currentCategory || !this.currentCategory.words || this.currentCategory.words.length === 0) return 0;
    return ((this.currentCardIndex + 1) / this.currentCategory.words.length) * 100;
  }
}
