import { Routes } from '@angular/router';
import { LessonListComponent } from './features/lessons/lesson-list.component';
import { LessonDetailComponent } from './features/lessons/lesson-detail.component';
import { NewsComponent } from './features/news/news.component';
import { AudioComponent } from './features/audio/audio.component';
import { SocialComponent } from './features/social/social.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'lessons' },
  { path: 'lessons', component: LessonListComponent },
  { path: 'lessons/:id', component: LessonDetailComponent },
  { path: 'news', component: NewsComponent },
  { path: 'audio', component: AudioComponent },
  { path: 'social', component: SocialComponent },
  { path: '**', redirectTo: 'lessons' }
];
