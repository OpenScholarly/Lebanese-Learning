import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService, NewsItem } from '../../shared/news.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'll-news',
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Live News Streams</h2>
      <div class="flex gap" style="flex-wrap:wrap">
        <div *ngFor="let c of channels()" style="min-width:280px">
          <h4>{{ c.name }}</h4>
          <iframe width="280" height="158" style="border:0" allowfullscreen [src]="c.safeUrl"></iframe>
        </div>
      </div>
    </div>
    <div class="card">
      <h2>Recent Headlines</h2>
      <ul>
        <li *ngFor="let n of news()">{{ n.title }}</li>
      </ul>
    </div>
  `
})
export class NewsComponent {
  private svc = inject(NewsService);
  private sanitizer = inject(DomSanitizer);
  channels = signal<{name:string; embedUrl:string; safeUrl: SafeResourceUrl}[]>([]);
  news = signal<NewsItem[]>([]);

  constructor(){
    this.svc.getChannels().subscribe((ch: {name:string;embedUrl:string}[]) => {
      const mapped = ch.map(c => ({ ...c, safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(c.embedUrl) }));
      this.channels.set(mapped);
    });
    this.svc.getHeadlines().subscribe((items: NewsItem[]|any) => this.news.set(items as NewsItem[]));
  }
}
