
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, retry, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { NotificationService } from "./notification.service";
import { User } from "../interfaces/User";

export class APIError extends Error {}

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient, private notifService: NotificationService) {}

  private handleError(error: APIError | HttpErrorResponse) {
    if(error instanceof APIError) {
      console.error(error);
      this.notifService.error(error.message);
      return throwError(() => error);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
      if(error.status === 0) {
        this.notifService.error('Erreur réseau. Veuillez vérifier votre connexion.');
      } else if(error.status === 400) {
        this.notifService.error('Requête invalide.', 'Erreur 400');
      } else if(error.status === 404) {
        this.notifService.error('Ressource non trouvée.', 'Erreur 404');
      } else if(error.status === 500) {
        this.notifService.error('Erreur serveur. Veuillez réessayer plus tard.', 'Erreur 500');
      } else if(error.status !== 401 && error.status !== 403) {
        this.notifService.error('Erreur lors de la récupération des données. Veuillez réessayer plus tard.', `Erreur ${error.status}`);
      } else {
        this.notifService.error('Erreur lors de la connexion. Veuillez réessayer plus tard.', `Erreur ${error.status}`);
      }
      return throwError(() => new Error('Something bad happened; please try again later.'));
    }
  }


  //========================= Connexion =========================
  login(username: string, password: string): Observable<User> {
    return this.http.post<{message: string, user:User}>(this.endpoint+"/login", {username, password}, {withCredentials: true, observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        if(response.status === 401) {
          console.error("Login failed");
          throw new APIError('Utilisateur inconnu ou Identifiants incorrects. Veuillez réessayer.');
        }
        else if((response.status !== 200 && response.status !== 204) || !response.body.user) {
          throw new APIError('Erreur lors de la connexion. Veuillez vérifier vos identifiants.');
        } else {
          return response.body.user;
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  signup(username: string, password: string): Observable<string> {
    return this.http.post<{message: string}>(this.endpoint+"/signup", {username, password}, {withCredentials: true, observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        if(response.status === 409) {
          throw new APIError('Username already exists');
        } else if(response.status !== 201) {
          throw new APIError('Signup failed');
        } else {
          console.log(response.body.message);
          return response.body.message;
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  logout(): Observable<string> {
    return this.http.post<{message: string}>(this.endpoint+"/logout", {}, {withCredentials: true, observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        if(response.status === 200 && response.body.message) {
          this.notifService.info('Vous avez été déconnecté avec succès.', 'Déconnexion');
          return response.body.message;
        } else {
          throw new APIError('Logout failed');
        }
      }),
      catchError(error => this.handleError(error))
    );
  }


  getUserData(): Observable<User|null> { // uses cookies
    return this.http.get<{user: User}>(this.endpoint+"/user", {withCredentials: true, observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        if(response.status === 200 && response.body.user) {
          return response.body.user as User;
        } else if(response.status === 204) {
          return null;
        } else if(response.body?.error) {
          throw new APIError(response.body.error);
        } else {
          throw new APIError('Erreur lors de la récupération des données utilisateur.');
        }
      }),
      catchError(error => this.handleError(error))
    );
  }



  // ======= TEMP =======

  getVocabularyCategories(): Observable<any> {
    return this.http.get<any>(this.endpoint+"/vocabulary/categories", {withCredentials: true, observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        if(response.status === 200 && response.body) {
          return response.body as any;
        } else if(response.body?.error) {
          throw new APIError(response.body.error);
        } else {
          throw new APIError('Erreur lors de la récupération des catégories de vocabulaire.');
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  getRadioStations(): Observable<any> {
    return this.http.get<any>(this.endpoint+"/media/radio", {withCredentials: true, observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        if(response.status === 200 && response.body) {
          return response.body as any;
        } else if(response.body?.error) {
          throw new APIError(response.body.error);
        } else {
          throw new APIError('Erreur lors de la récupération des stations de radio.');
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  getPodcasts(): Observable<any> {
    return this.http.get<any>(this.endpoint+"/media/podcasts", {withCredentials: true, observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        if(response.status === 200 && response.body) {
          return response.body as any;
        } else if(response.body?.error) {
          throw new APIError(response.body.error);
        } else {
          throw new APIError('Erreur lors de la récupération des podcasts.');
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  getTVShows(): Observable<any> {
    return this.http.get<any>(this.endpoint+"/media/tvshows", {withCredentials: true, observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        if(response.status === 200 && response.body) {
          return response.body as any;
        } else if(response.body?.error) {
          throw new APIError(response.body.error);
        } else {
          throw new APIError('Erreur lors de la récupération des émissions de télévision.');
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  getCultureData(): Observable<any> { // "/culture"
    return this.http.get<any>(this.endpoint+"/culture", {withCredentials: true, observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        if(response.status === 200 && response.body) {
          return response.body as any;
        } else if(response.body?.error) {
          throw new APIError(response.body.error);
        } else {
          throw new APIError('Erreur lors de la récupération des données culturelles.');
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  getNewsChannels(): Observable<any> {
    return this.http.get<any>(this.endpoint+"/media/news", {withCredentials: true, observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        if(response.status === 200 && response.body) {
          return response.body as any;
        } else if(response.body?.error) {
          throw new APIError(response.body.error);
        } else {
          throw new APIError('Erreur lors de la récupération des chaînes d\'information.');
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  getGrammarTopics(): Observable<any> {
    return this.http.get<any>(this.endpoint+"/grammar/topics", {withCredentials: true, observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        if(response.status === 200 && response.body) {
          return response.body as any;
        } else if(response.body?.error) {
          throw new APIError(response.body.error);
        } else {
          throw new APIError('Erreur lors de la récupération des sujets de grammaire.');
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  getAllVocabulary(): Observable<any> {
    return this.http.get<any>(this.endpoint+"/vocabulary/all", {withCredentials: true, observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        if(response.status === 200 && response.body) {
          return response.body as any;
        } else if(response.body?.error) {
          throw new APIError(response.body.error);
        } else {
          throw new APIError('Erreur lors de la récupération de tout le vocabulaire.');
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<any>(this.endpoint+"/search/users", {withCredentials: true, observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        if(response.status === 200 && response.body) {
          return Object.values(response.body) as User[];
        } else if(response.body?.error) {
          this.notifService.error(response.body.error);
          return [];
        } else {
          return [];
        }
      }),
      retry(2),
      catchError(error => this.handleError(error))
    );
  }

}
