import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SidebarService } from 'src/app/services/sidebar.service';
import { ThemePreference, ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private destroy$ = new Subject<void>();
  isSideBarOpen: boolean = false;
  theme!: ThemePreference;


  menuItems = [
    { name: 'Dashboard', icon: '🏠', route: '/dashboard', section: 'dashboard' },
    { name: 'Vocabulary (130+)', icon: '📚', route: '/vocabulary', section: 'vocabulary' },
    { name: 'Grammar', icon: '📖', route: '/grammar', section: 'grammar' },
    { name: 'Radio Stations', icon: '📻', route: '/radio', section: 'radio' },
    { name: 'Podcasts', icon: '🎧', route: '/podcasts', section: 'podcasts' },
    { name: 'TV Shows', icon: '📺', route: '/tvshows', section: 'tvshows' },
    { name: 'Culture', icon: '🎭', route: '/culture', section: 'culture' },
    { name: 'News', icon: '📰', route: '/news', section: 'news' },
    { name: 'Translate', icon: '🌐', route: '/translate', section: 'translate' },
    { name: 'Profile', icon: '👤', route: '/profile', section: 'profile' }
  ];

  constructor(public sidebarService: SidebarService, private themeService: ThemeService) {
    this.sidebarService.isOpen$.pipe(takeUntil(this.destroy$)).subscribe((open) => this.isSideBarOpen = open);
    this.theme = this.themeService.preference;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTheme() {
    if (this.theme === 'light') {
      this.themeService.setPreference('dark');
      this.theme = 'dark';
    } else if (this.theme === 'dark') {
      this.themeService.setPreference('system');
      this.theme = 'system';
    } else {
      this.themeService.setPreference('light');
      this.theme = 'light';
    }
  }

  get sideBarState() {
    return this.isSideBarOpen ? 'in' : 'out';
  }
}
