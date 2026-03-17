import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/interfaces/User';
import { SidebarService } from 'src/app/services/sidebar.service';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private destroy$ = new Subject<void>();
  public user!: User;

  constructor(public sidebarService: SidebarService, private appStore: AppStore) {
    this.appStore.currentUser.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if(user) {
        this.user = user;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
