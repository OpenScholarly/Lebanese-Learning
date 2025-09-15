import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header>
      <strong>Lebanese Learning</strong>
      <nav class="grow">
        <a routerLink="/lessons" routerLinkActive="active">Lessons</a>
        <a routerLink="/news" routerLinkActive="active">News</a>
        <a routerLink="/audio" routerLinkActive="active">Audio</a>
        <a routerLink="/social" routerLinkActive="active">Social</a>
      </nav>
      <div *ngIf="userLevel()">Level <span class="level-badge">{{ userLevel() }}</span></div>
    </header>
    <main class="container">
      <router-outlet />
    </main>
  `
})
export class AppComponent {
  userLevel = signal<number | null>(1);
}
