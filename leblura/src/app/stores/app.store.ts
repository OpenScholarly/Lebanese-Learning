import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { APIService } from "../services/api.service";
import { SpinnerService } from "../services/spinner.service";
import { NotificationService } from "../services/notification.service";
import { User } from "../interfaces/User";


@Injectable({
  providedIn: 'root'
})
export class AppStore {
  public currentUser: BehaviorSubject<User|undefined> = new BehaviorSubject<User|undefined>(undefined);
  public appData = {
    vocabularyCategories: {},
    radioStations: [],
    podcasts: [],
    tvShows: [],
    culture: {},
    newsChannels: [],
    grammarTopics: []
  };

  constructor(private apiService: APIService, private spinnerService: SpinnerService, private notifService: NotificationService) {}


  updateUser(userData: Partial<User>) {
    if(!userData) return;
    if(!this.currentUser.value) {
      this.currentUser.next({} as User);
    }
    const current = this.currentUser.value as User;
    const updated = { ...current, ...userData };
    this.currentUser.next(updated);
  }

  removeUser() {
    this.currentUser.next(undefined);
  }
}
