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
import { authGuard } from './services/authGard.service';

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
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'culture',
    component: CultureComponent,
    canActivate: [authGuard]
  },
  {
    path: 'grammar',
    component: GrammarComponent,
    canActivate: [authGuard]
  },
  {
    path: 'vocabulary',
    component: VocabularyComponent,
    canActivate: [authGuard]
  },
  {
    path: 'news',
    component: NewsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'radio',
    component: RadioComponent,
    canActivate: [authGuard]
  },
  {
    path: 'translate',
    component: TranslateComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tvshows',
    component: TvshowsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'podcasts',
    component: PodcastsComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
