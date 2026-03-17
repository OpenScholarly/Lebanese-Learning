import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { AppLayoutComponent } from './components/layout/app-layout/app-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LandingComponent } from './components/landing/landing.component';
import { SignupComponent } from './components/signup/signup.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { VocabularyComponent } from './components/vocabulary/vocabulary.component';
import { GrammarComponent } from './components/grammar/grammar.component';
import { RadioComponent } from './components/radio/radio.component';
import { PodcastsComponent } from './components/podcasts/podcasts.component';
import { TvshowsComponent } from './components/tvshows/tvshows.component';
import { CultureComponent } from './components/culture/culture.component';
import { NewsComponent } from './components/news/news.component';
import { TranslateComponent } from './components/translate/translate.component';
import { ProfileComponent } from './components/profile/profile.component';
import { APIService } from './services/api.service';
import { environment } from 'src/environments/environment';
import { MockAPIService } from './services/mocks/mock-api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AppLayoutComponent,
    DashboardComponent,
    LandingComponent,
    SignupComponent,
    SidebarComponent,
    VocabularyComponent,
    GrammarComponent,
    RadioComponent,
    PodcastsComponent,
    TvshowsComponent,
    CultureComponent,
    NewsComponent,
    TranslateComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
      {
        provide: APIService,
        useClass: environment.mockAuth ? MockAPIService : APIService
      },
      provideRouter(routes),
      provideHttpClient(),
      provideAnimations(),
      provideToastr()
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
