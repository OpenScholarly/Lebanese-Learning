import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, retry, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { NotificationService } from "../notification.service";
import { User } from "../../interfaces/User";
import { APIError } from "../api.service";
import { MockData } from "./mockData";

@Injectable({
  providedIn: 'root'
})
export class MockAPIService {
  private endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient, private notifService: NotificationService) { }

  private handleError(error: APIError | HttpErrorResponse) {
    if (error instanceof APIError) {
      console.error(error);
      this.notifService.error(error.message);
      return throwError(() => error);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
      if (error.status === 0) {
        this.notifService.error('Erreur réseau. Veuillez vérifier votre connexion.');
      } else if (error.status === 400) {
        this.notifService.error('Requête invalide.', 'Erreur 400');
      } else if (error.status === 404) {
        this.notifService.error('Ressource non trouvée.', 'Erreur 404');
      } else if (error.status === 500) {
        this.notifService.error('Erreur serveur. Veuillez réessayer plus tard.', 'Erreur 500');
      } else if (error.status !== 401 && error.status !== 403) {
        this.notifService.error('Erreur lors de la récupération des données. Veuillez réessayer plus tard.', `Erreur ${error.status}`);
      } else {
        this.notifService.error('Erreur lors de la connexion. Veuillez réessayer plus tard.', `Erreur ${error.status}`);
      }
      return throwError(() => new Error('Something bad happened; please try again later.'));
    }
  }


  //========================= Connexion =========================
  login(username: string, password: string): Observable<User> {
    return of(MockData.User);
  }

  signup(username: string, password: string): Observable<string> {
    return of("Signup successful (mock)!");
  }

  logout(): Observable<string> {
    return of("Logout successful (mock)!");
  }

  getVocabularyCategories(): Observable<any> {
    return of(MockData.vocabularyCategories);
  }

  getRadioStations(): Observable<any> {
    return of(MockData.radioStations);
  }

  getPodcasts(): Observable<any> {
    return of(MockData.podcasts);
  }

  getTVShows(): Observable<any> {
    return of(MockData.tvShows);
  }

  getCultureData(): Observable<any> {
    return of(MockData.culture);
  }

  getNewsChannels(): Observable<any> {
    return of(MockData.newsChannels);
  }

  getGrammarTopics(): Observable<any> {
    return of(MockData.grammarTopics);
  }

  getAllVocabulary(): Observable<any> {
    return of(MockData.allVocabulary);
  }
}
