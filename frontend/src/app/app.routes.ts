import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'lessons' },
  { path: 'lessons', loadComponent: () => import('./features/lessons/lesson-list.component').then(m => m.LessonListComponent) },
  { path: 'lessons/:id', loadComponent: () => import('./features/lessons/lesson-detail.component').then(m => m.LessonDetailComponent) },
  { path: 'news', loadComponent: () => import('./features/news/news.component').then(m => m.NewsComponent) },
  { path: 'audio', loadComponent: () => import('./features/audio/audio.component').then(m => m.AudioComponent) },
  { path: 'social', loadComponent: () => import('./features/social/social.component').then(m => m.SocialComponent) },
  { path: '**', redirectTo: 'lessons' }
];
