import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LessonService, LessonSummary } from '../../shared/lesson.service';

@Component({
  standalone: true,
  selector: 'll-lesson-list',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card" *ngFor="let l of lessons()">
      <h3><a [routerLink]="['/lessons', l.id]">{{ l.title }}</a> <span class="level-badge">L{{ l.level }}</span></h3>
      <p>{{ l.description }}</p>
    </div>
  `
})
export class LessonListComponent {
  private svc = inject(LessonService);
  lessons = signal<LessonSummary[]>([]);

  constructor() {
    this.svc.listSummaries().subscribe(ls => this.lessons.set(ls));
  }
}
