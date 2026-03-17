import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { APIService } from "../services/api.service";
import { SpinnerService } from "../services/spinner.service";
import { NotificationService } from "../services/notification.service";
import { User } from "../interfaces/User";
import { VocabularyStore } from "./vocabulary.store";
import { MediaStore } from "./media.store";
import { LearningStore } from "./learning.store";

@Injectable({
  providedIn: 'root'
})
export class AppStore {
  public currentUser: BehaviorSubject<User|undefined> = new BehaviorSubject<User|undefined>(undefined);
  
  // Create mock user data for demonstration
  private mockUser: User = {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    level: 3,
    xp: 750,
    currentCard: 0,
    selectedCategory: "greetings_basic",
    learningMode: "flashcards",
    currentGrammarTopic: null,
    savedTranslations: [],
    translationHistory: [],
    settings: {
      proficiency: 'intermediate',
      audioEnabled: true,
      slowAudioEnabled: false,
      autoPlayEnabled: true,
      dailyReminders: true,
      streakReminders: true,
      achievementNotifications: true
    },
    stats: {
      wordsLearned: 89,
      masteredWords: 67,
      difficultWords: 22,
      totalWords: 156,
      dailyGoal: 20,
      streakDays: 12,
      studyTime: 1440, // 24 hours in minutes
      achievements: [
        { id: "1", name: "First Steps", description: "Completed first lesson", dateEarned: new Date('2024-01-01') },
        { id: "2", name: "Week Warrior", description: "7-day streak", dateEarned: new Date('2024-01-08') }
      ]
    }
  };

  // Combined loading state from all stores
  public loading$: Observable<boolean>;

  constructor(
    private apiService: APIService, 
    private spinnerService: SpinnerService, 
    private notifService: NotificationService,
    private vocabularyStore: VocabularyStore,
    private mediaStore: MediaStore,
    private learningStore: LearningStore
  ) {
    // Set mock user initially
    this.currentUser.next(this.mockUser);

    // Combine loading states from all stores
    this.loading$ = combineLatest([
      this.vocabularyStore.loading$,
      this.mediaStore.loading$,
      this.learningStore.loading$
    ]).pipe(
      map(([vocab, media, learning]) => vocab || media || learning)
    );
  }

  // Initialize all data stores
  initializeApp() {
    this.vocabularyStore.loadVocabularyData().subscribe();
    this.mediaStore.loadRadioStations().subscribe();
    this.mediaStore.loadPodcasts().subscribe();
    this.mediaStore.loadTVShows().subscribe();
    this.mediaStore.loadNewsChannels().subscribe();
    this.learningStore.loadCultureData().subscribe();
    this.learningStore.loadGrammarContent().subscribe();
    this.learningStore.loadLearningChannels().subscribe();
    this.learningStore.loadTranslationServices().subscribe();
  }

  updateUser(userData: Partial<User>) {
    if(!userData) return;
    if(!this.currentUser.value) {
      this.currentUser.next({} as User);
    }
    const current = this.currentUser.value as User;
    const updated = { ...current, ...userData };
    this.currentUser.next(updated);
  }

  removeUser() {
    this.currentUser.next(undefined);
  }

  // User authentication methods
  login(username: string, password: string): Observable<User> {
    return this.apiService.login(username, password).pipe(
      map((user: User) => {
        this.currentUser.next(user);
        return user;
      })
    );
  }

  logout(): Observable<string> {
    return this.apiService.logout().pipe(
      map((message: string) => {
        this.removeUser();
        return message;
      })
    );
  }

  loadUserData(): Observable<User | null> {
    return this.apiService.getUserData().pipe(
      map((user: User | null) => {
        if (user) {
          this.currentUser.next(user);
        } else {
          // Use mock user if no authenticated user
          this.currentUser.next(this.mockUser);
        }
        return user;
      })
    );
  }
}
