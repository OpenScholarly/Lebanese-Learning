import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { AppStore } from '../../stores/app.store';
import { VocabularyStore } from '../../stores/vocabulary.store';
import { MediaStore } from '../../stores/media.store';
import { LearningStore } from '../../stores/learning.store';
import { User } from '../../interfaces/User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  totalVocabularyWords: number = 0;
  totalRadioStations: number = 0;
  totalPodcasts: number = 0;
  totalCultureTopics: number = 0;
  vocabularyCategories: number = 0;
  loading: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private appStore: AppStore,
    private vocabularyStore: VocabularyStore,
    private mediaStore: MediaStore,
    private learningStore: LearningStore
  ) {}

  ngOnInit() {
    // Subscribe to current user
    this.subscriptions.push(
      this.appStore.currentUser.subscribe(user => {
        this.currentUser = user || null;
      })
    );

    // Subscribe to loading state
    this.subscriptions.push(
      this.appStore.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );

    // Subscribe to vocabulary data for statistics
    this.subscriptions.push(
      this.vocabularyStore.vocabularyData$.subscribe(data => {
        this.vocabularyCategories = Object.keys(data).length;
        this.totalVocabularyWords = Object.values(data).reduce(
          (total, category) => total + category.words.length, 0
        );
      })
    );

    // Subscribe to media data for statistics
    this.subscriptions.push(
      combineLatest([
        this.mediaStore.radioStations$,
        this.mediaStore.podcasts$
      ]).subscribe(([radio, podcasts]) => {
        this.totalRadioStations = radio.length;
        this.totalPodcasts = podcasts.length;
      })
    );

    // Subscribe to culture data for statistics
    this.subscriptions.push(
      this.learningStore.cultureData$.subscribe(data => {
        this.totalCultureTopics = Object.keys(data).length;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getLearningProgress(): number {
    if (!this.currentUser || this.totalVocabularyWords === 0) return 0;
    return Math.round((this.currentUser.stats.wordsLearned / this.totalVocabularyWords) * 100);
  }

  getMasteryProgress(): number {
    if (!this.currentUser || this.currentUser.stats.wordsLearned === 0) return 0;
    return Math.round((this.currentUser.stats.masteredWords / this.currentUser.stats.wordsLearned) * 100);
  }

  getNextLevelProgress(): number {
    if (!this.currentUser) return 0;
    const xpForCurrentLevel = (this.currentUser.level - 1) * 1000;
    const xpForNextLevel = this.currentUser.level * 1000;
    const progressInLevel = this.currentUser.xp - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
    return Math.round((progressInLevel / xpNeededForLevel) * 100);
  }

  getDailyGoalProgress(): number {
    if (!this.currentUser) return 0;
    // Mock daily progress - in real app this would come from daily tracking
    const dailyWordsLearned = 15; // Example
    return Math.round((dailyWordsLearned / this.currentUser.stats.dailyGoal) * 100);
  }

  getStudyTimeHours(): number {
    if (!this.currentUser) return 0;
    return Math.round(this.currentUser.stats.studyTime / 60 * 10) / 10; // Convert minutes to hours with 1 decimal
  }

  getRecentAchievements() {
    if (!this.currentUser) return [];
    return this.currentUser.stats.achievements.slice(-3); // Last 3 achievements
  }
}
