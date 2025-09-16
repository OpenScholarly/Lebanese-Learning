import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private destroy$ = new Subject<void>();
  isSideBarOpen: boolean = false;
  notificationCount: number = 0;

  constructor(public sidebarService: SidebarService) {
    this.sidebarService.isOpen$.pipe(takeUntil(this.destroy$)).subscribe((open) => this.isSideBarOpen = open);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get sideBarState() {
    return this.isSideBarOpen ? 'in' : 'out';
  }
}
