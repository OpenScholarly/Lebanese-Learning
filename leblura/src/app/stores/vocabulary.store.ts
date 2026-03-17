import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { APIService } from '../services/api.service';
import { VocabularyData, VocabularyCategory } from '../interfaces/LearningData';

@Injectable({
  providedIn: 'root'
})
export class VocabularyStore {
  private vocabularyDataSubject = new BehaviorSubject<VocabularyData>({});
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public vocabularyData$ = this.vocabularyDataSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  // Mock data fallback
  private mockData: VocabularyData = {};

  constructor(private apiService: APIService) {
    this.loadMockData();
  }

  private async loadMockData() {
    try {
      const response = await fetch('/assets/lebanese_vocabulary.json');
      this.mockData = await response.json();
      // Load mock data initially
      this.vocabularyDataSubject.next(this.mockData);
    } catch (error) {
      console.error('Failed to load mock vocabulary data:', error);
    }
  }

  loadVocabularyData(): Observable<VocabularyData> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.apiService.getAllVocabulary().pipe(
      tap((data: VocabularyData) => {
        this.vocabularyDataSubject.next(data);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.warn('API failed, using mock data:', error);
        this.errorSubject.next('Using offline data');
        this.vocabularyDataSubject.next(this.mockData);
        this.loadingSubject.next(false);
        return of(this.mockData);
      })
    );
  }

  getVocabularyCategories(): Observable<VocabularyCategory[]> {
    return new Observable(observer => {
      this.vocabularyData$.subscribe(data => {
        const categories = Object.values(data);
        observer.next(categories);
      });
    });
  }

  getVocabularyByCategory(categoryKey: string): Observable<VocabularyCategory | null> {
    return new Observable(observer => {
      this.vocabularyData$.subscribe(data => {
        observer.next(data[categoryKey] || null);
      });
    });
  }

  searchVocabulary(searchTerm: string): Observable<VocabularyCategory[]> {
    return new Observable(observer => {
      this.vocabularyData$.subscribe(data => {
        const filtered: VocabularyCategory[] = [];
        
        Object.values(data).forEach(category => {
          const matchingWords = category.words.filter(word => 
            word.arabic.includes(searchTerm) ||
            word.pronunciation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
            word.french.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
          if (matchingWords.length > 0) {
            filtered.push({
              ...category,
              words: matchingWords
            });
          }
        });
        
        observer.next(filtered);
      });
    });
  }
}