import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButton } from '@spartan/helm/button';
import { HlmBadge } from '@spartan/helm/badge';
import { HlmAvatar, HlmAvatarFallback, HlmAvatarImage } from '@spartan/helm/avatar';
import { lucideBell, lucideGlobe, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { RouterLink } from '@angular/router';
import { TranslatePipe, LocaleService } from '@invento/core';
import { BrandLogo } from '@invento/shared';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgIcon,
    HlmButton,
    HlmBadge,
    HlmAvatar,
    HlmAvatarImage,
    HlmAvatarFallback,
    TranslatePipe,
    BrandLogo,
  ],
  providers: [
    provideIcons({
      lucideBell,
      lucideGlobe,
      lucideMoon,
      lucideSun,
    }),
  ],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly localeService = inject(LocaleService);
  protected readonly isDark = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined') {
      this.isDark.set(document.documentElement.classList.contains('dark'));
    }
  }

  switchLocale(): void {
    const next = this.localeService.locale() === 'en' ? 'ar' : 'en';
    this.localeService.switchLocale(next);
  }

  toggleTheme(): void {
    if (typeof window === 'undefined') return;
    
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      this.isDark.set(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      this.isDark.set(true);
    }
  }
}
