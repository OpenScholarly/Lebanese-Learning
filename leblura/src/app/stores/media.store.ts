import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { APIService } from '../services/api.service';
import { RadioStation, Podcast, TVShow, NewsChannel } from '../interfaces/LearningData';

@Injectable({
  providedIn: 'root'
})
export class MediaStore {
  private radioStationsSubject = new BehaviorSubject<RadioStation[]>([]);
  private podcastsSubject = new BehaviorSubject<Podcast[]>([]);
  private tvShowsSubject = new BehaviorSubject<TVShow[]>([]);
  private newsChannelsSubject = new BehaviorSubject<NewsChannel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public radioStations$ = this.radioStationsSubject.asObservable();
  public podcasts$ = this.podcastsSubject.asObservable();
  public tvShows$ = this.tvShowsSubject.asObservable();
  public newsChannels$ = this.newsChannelsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  // Mock data fallbacks
  private mockRadioStations: RadioStation[] = [];
  private mockPodcasts: Podcast[] = [];
  private mockTVShows: TVShow[] = [];
  private mockNewsChannels: NewsChannel[] = [];

  constructor(private apiService: APIService) {
    this.loadMockData();
  }

  private async loadMockData() {
    try {
      const [radioResponse, podcastResponse, tvResponse, newsResponse] = await Promise.all([
        fetch('/assets/lebanese_radio_stations.json'),
        fetch('/assets/lebanese_podcasts.json'),
        fetch('/assets/lebanese_tv_shows.json'),
        fetch('/assets/news_channels.json')
      ]);

      this.mockRadioStations = await radioResponse.json();
      this.mockPodcasts = await podcastResponse.json();
      this.mockTVShows = await tvResponse.json();
      this.mockNewsChannels = await newsResponse.json();

      // Load mock data initially
      this.radioStationsSubject.next(this.mockRadioStations);
      this.podcastsSubject.next(this.mockPodcasts);
      this.tvShowsSubject.next(this.mockTVShows);
      this.newsChannelsSubject.next(this.mockNewsChannels);
    } catch (error) {
      console.error('Failed to load mock media data:', error);
    }
  }

  loadRadioStations(): Observable<RadioStation[]> {
    this.loadingSubject.next(true);
    
    return this.apiService.getRadioStations().pipe(
      tap((data: RadioStation[]) => {
        this.radioStationsSubject.next(data);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.warn('Radio API failed, using mock data:', error);
        this.radioStationsSubject.next(this.mockRadioStations);
        this.loadingSubject.next(false);
        return of(this.mockRadioStations);
      })
    );
  }

  loadPodcasts(): Observable<Podcast[]> {
    this.loadingSubject.next(true);
    
    return this.apiService.getPodcasts().pipe(
      tap((data: Podcast[]) => {
        this.podcastsSubject.next(data);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.warn('Podcast API failed, using mock data:', error);
        this.podcastsSubject.next(this.mockPodcasts);
        this.loadingSubject.next(false);
        return of(this.mockPodcasts);
      })
    );
  }

  loadTVShows(): Observable<TVShow[]> {
    this.loadingSubject.next(true);
    
    return this.apiService.getTVShows().pipe(
      tap((data: TVShow[]) => {
        this.tvShowsSubject.next(data);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.warn('TV Shows API failed, using mock data:', error);
        this.tvShowsSubject.next(this.mockTVShows);
        this.loadingSubject.next(false);
        return of(this.mockTVShows);
      })
    );
  }

  loadNewsChannels(): Observable<NewsChannel[]> {
    this.loadingSubject.next(true);
    
    return this.apiService.getNewsChannels().pipe(
      tap((data: NewsChannel[]) => {
        this.newsChannelsSubject.next(data);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.warn('News API failed, using mock data:', error);
        this.newsChannelsSubject.next(this.mockNewsChannels);
        this.loadingSubject.next(false);
        return of(this.mockNewsChannels);
      })
    );
  }

  searchRadioStations(searchTerm: string): Observable<RadioStation[]> {
    return new Observable(observer => {
      this.radioStations$.subscribe(stations => {
        const filtered = stations.filter(station =>
          station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          station.name_arabic.includes(searchTerm) ||
          station.genre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        observer.next(filtered);
      });
    });
  }

  searchPodcasts(searchTerm: string): Observable<Podcast[]> {
    return new Observable(observer => {
      this.podcasts$.subscribe(podcasts => {
        const filtered = podcasts.filter(podcast =>
          podcast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          podcast.name_arabic.includes(searchTerm) ||
          podcast.host.toLowerCase().includes(searchTerm.toLowerCase())
        );
        observer.next(filtered);
      });
    });
  }
}