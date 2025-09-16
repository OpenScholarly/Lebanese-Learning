import { Component } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  private destroy$ = new Subject<void>();
  public user!: User;

  constructor(private appStore: AppStore) {
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
