import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LessonService, Lesson } from '../../shared/lesson.service';

@Component({
  standalone: true,
  selector: 'll-lesson-detail',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card" *ngIf="lesson() as lesson">
      <a routerLink="/lessons">← Back</a>
      <h2>{{ lesson.title }} <span class="level-badge">L{{ lesson.level }}</span></h2>
      <p>{{ lesson.description }}</p>
      <ol>
        <li *ngFor="let item of lesson.items">
          <strong>{{ item.arabic }}</strong> — {{ item.english }}
          <div *ngIf="item.audioUrl">
            <audio controls [src]="item.audioUrl"></audio>
          </div>
        </li>
      </ol>
    </div>
  `
})
export class LessonDetailComponent {
  private svc = inject(LessonService);
  private route = inject(ActivatedRoute);
  lesson = signal<Lesson | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getLesson(id).subscribe(l => this.lesson.set(l));
  }
}
