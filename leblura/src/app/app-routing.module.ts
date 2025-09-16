import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LandingComponent } from './components/landing/landing.component';
import { CultureComponent } from './components/culture/culture.component';
import { GrammarComponent } from './components/grammar/grammar.component';
import { VocabularyComponent } from './components/vocabulary/vocabulary.component';
import { NewsComponent } from './components/news/news.component';
import { RadioComponent } from './components/radio/radio.component';
import { TranslateComponent } from './components/translate/translate.component';
import { TvshowsComponent } from './components/tvshows/tvshows.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PodcastsComponent } from './components/podcasts/podcasts.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'culture',
    component: CultureComponent
  },
  {
    path: 'grammar',
    component: GrammarComponent
  },
  {
    path: 'vocabulary',
    component: VocabularyComponent
  },
  {
    path: 'news',
    component: NewsComponent
  },
  {
    path: 'radio',
    component: RadioComponent
  },
  {
    path: 'translate',
    component: TranslateComponent
  },
  {
    path: 'tvshows',
    component: TvshowsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'podcasts',
    component: PodcastsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
