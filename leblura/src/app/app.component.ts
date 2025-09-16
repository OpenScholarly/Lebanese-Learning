import { Component, Inject } from '@angular/core';
import { AppStore } from './stores/app.store';
import { APIService } from './services/api.service';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { NotificationService } from './services/notification.service';
import { DOCUMENT } from '@angular/common';
import { finalize } from 'rxjs';
import { User } from './interfaces/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'LebLura';
  isDarkMode: boolean = false;
  isLoading: boolean = true;

  constructor(
    private appStore: AppStore,
    private apiService: APIService,
    private router: Router,
    public theme: ThemeService,
    private notifService: NotificationService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    const publicRoutes = ['/landing', '/login', '/register'];

    this.apiService.getUserData().pipe(finalize(() => { this.isLoading = false; })).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.appStore.updateUser(user);
          // If a logged-in user lands on a public page, send them to home.
          if (publicRoutes.includes(this.router.url)) {
            this.router.navigate(['/home']);
          }
        } else {
          this.appStore.removeUser();
          // If the API call fails (unauthenticated) AND the user is NOT on a public route...
          if (!publicRoutes.includes(this.router.url)) {
            this.router.navigate(['/landing']);
          }
        }
      },
      error: () => {
        this.appStore.removeUser();
        // If the API call fails (unauthenticated) AND the user is NOT on a public route...
        if (!publicRoutes.includes(this.router.url)) {
          this.router.navigate(['/landing']);
        }
      }
    });
  }

  // pollNotifications() {
  //   setInterval(() => {
  //     // Skip polling if on quiz play route
  //     const blockRoutes = ['/404', '/quiz-question', '/quiz-recap', '/quiz-score', 'landing', 'login', 'register'];
  //     const currentUrl = this.router.url;

  //     if (blockRoutes.some(blocked => currentUrl.startsWith(blocked))) {
  //       return;
  //     }

  //     this.apiService.getNotifications().subscribe((gameRequests: GameRequest[] | undefined) => {
  //       let notifs: GameRequest[] = [];
  //       if (!gameRequests) {
  //         this.appStore.clearNotifications();
  //       } else {
  //         gameRequests.forEach((gameRequest) => {
  //           this.apiService.getUserFromId(gameRequest.id_requestor).subscribe((user) => {
  //             notifs.push({
  //               datetime: gameRequest.datetime,
  //               id_session: gameRequest.id_session,
  //               id_requestor: gameRequest.id_requestor,
  //               id_validator: gameRequest.id_validator,
  //               username: user?.username || "inconnu"
  //             })
  //           })
  //         })
  //       }

  //       const newNotifs = notifs.filter(notif => !this.appStore['existingSessions'].has(notif.id_session));
  //       if (newNotifs.length > 0) {
  //         this.appStore.addNewNotifications(newNotifs);
  //         for (const notif of newNotifs) {
  //           this.notifService.info(`Invitation de ${notif.username}.`);
  //         }
  //       }
  //     });
  //   }, 5000);
  // }
}

