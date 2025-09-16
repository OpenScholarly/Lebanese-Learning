import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { APIService } from '../services/api.service';
import { CultureData, GrammarContent, LearningChannel, TranslationService } from '../interfaces/LearningData';

@Injectable({
  providedIn: 'root'
})
export class LearningStore {
  private cultureDataSubject = new BehaviorSubject<CultureData>({});
  private grammarContentSubject = new BehaviorSubject<GrammarContent>({});
  private learningChannelsSubject = new BehaviorSubject<LearningChannel[]>([]);
  private translationServicesSubject = new BehaviorSubject<TranslationService[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public cultureData$ = this.cultureDataSubject.asObservable();
  public grammarContent$ = this.grammarContentSubject.asObservable();
  public learningChannels$ = this.learningChannelsSubject.asObservable();
  public translationServices$ = this.translationServicesSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  // Mock data fallbacks
  private mockCultureData: CultureData = {};
  private mockGrammarContent: GrammarContent = {};
  private mockLearningChannels: LearningChannel[] = [];
  private mockTranslationServices: TranslationService[] = [];

  constructor(private apiService: APIService) {
    this.loadMockData();
  }

  private async loadMockData() {
    try {
      const [cultureResponse, grammarResponse, channelsResponse, translationResponse] = await Promise.all([
        fetch('/assets/lebanese_culture.json'),
        fetch('/assets/grammar_content.json'),
        fetch('/assets/learning_channels.json'),
        fetch('/assets/translation_services.json')
      ]);

      this.mockCultureData = await cultureResponse.json();
      this.mockGrammarContent = await grammarResponse.json();
      this.mockLearningChannels = await channelsResponse.json();
      const translationJson = await translationResponse.json();
      this.mockTranslationServices = [
        ...(Array.isArray(translationJson.apis) ? translationJson.apis : []),
        ...(Array.isArray(translationJson.tts_services) ? translationJson.tts_services : [])
      ];

      // Load mock data initially
      this.cultureDataSubject.next(this.mockCultureData);
      this.grammarContentSubject.next(this.mockGrammarContent);
      this.learningChannelsSubject.next(this.mockLearningChannels);
      this.translationServicesSubject.next(this.mockTranslationServices);
    } catch (error) {
      console.error('Failed to load mock learning data:', error);
    }
  }

  loadCultureData(): Observable<CultureData> {
    this.loadingSubject.next(true);
    
    return this.apiService.getCultureData().pipe(
      tap((data: CultureData) => {
        this.cultureDataSubject.next(data);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.warn('Culture API failed, using mock data:', error);
        this.cultureDataSubject.next(this.mockCultureData);
        this.loadingSubject.next(false);
        return of(this.mockCultureData);
      })
    );
  }

  loadGrammarContent(): Observable<GrammarContent> {
    this.loadingSubject.next(true);
    
    return this.apiService.getGrammarTopics().pipe(
      tap((data: GrammarContent) => {
        this.grammarContentSubject.next(data);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.warn('Grammar API failed, using mock data:', error);
        this.grammarContentSubject.next(this.mockGrammarContent);
        this.loadingSubject.next(false);
        return of(this.mockGrammarContent);
      })
    );
  }

  // Learning channels and translation services don't have API endpoints yet,
  // so we'll use mock data for now
  loadLearningChannels(): Observable<LearningChannel[]> {
    this.learningChannelsSubject.next(this.mockLearningChannels);
    return of(this.mockLearningChannels);
  }

  loadTranslationServices(): Observable<TranslationService[]> {
    this.translationServicesSubject.next(this.mockTranslationServices);
    return of(this.mockTranslationServices);
  }

  searchCulture(searchTerm: string): Observable<CultureData> {
    return new Observable(observer => {
      this.cultureData$.subscribe(data => {
        const filtered: CultureData = {};
        
        Object.entries(data).forEach(([key, arr]) => {
          if (Array.isArray(arr)) {
            // Filter items in the array that match the search term in any relevant property
            const matches = arr.filter((item: any) => {
              return (
                (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.title_arabic && item.title_arabic.includes(searchTerm)) ||
                (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
              );
            });
            if (matches.length > 0) {
              filtered[key] = matches;
            }
          }
        });
        
        observer.next(filtered);
      });
    });
  }

  searchGrammar(searchTerm: string): Observable<GrammarContent> {
    return new Observable(observer => {
      this.grammarContent$.subscribe(data => {
        const filtered: GrammarContent = {};
        
        Object.entries(data).forEach(([key, rule]) => {
          if (rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              rule.title_arabic.includes(searchTerm) ||
              rule.explanation.toLowerCase().includes(searchTerm.toLowerCase())) {
            filtered[key] = rule;
          }
        });
        
        observer.next(filtered);
      });
    });
  }
}