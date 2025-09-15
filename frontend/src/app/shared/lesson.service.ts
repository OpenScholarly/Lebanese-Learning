import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LessonSummary { id: string; title: string; level: number; description: string; }
export interface LessonItem { arabic: string; english: string; audioUrl?: string; }
export interface Lesson extends LessonSummary { items: LessonItem[]; }

@Injectable({ providedIn: 'root' })
export class LessonService {
  private http = inject(HttpClient);
  listSummaries(): Observable<LessonSummary[]> { return this.http.get<LessonSummary[]>('/api/lessons'); }
  getLesson(id: string): Observable<Lesson> { return this.http.get<Lesson>(`/api/lessons/${id}`); }
}
