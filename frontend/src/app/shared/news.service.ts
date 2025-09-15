import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NewsItem { title: string; url?: string; source?: string; }

@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);
  getChannels(): Observable<{name:string;embedUrl:string}[]> { return this.http.get<{name:string;embedUrl:string}[]>('/api/news/channels'); }
  getHeadlines(): Observable<NewsItem[]> { return this.http.get<NewsItem[]>('/api/news/headlines'); }
}
