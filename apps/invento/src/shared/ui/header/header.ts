import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButton } from '@spartan/helm/button';
import { HlmBadge } from '@spartan/helm/badge';
import { HlmAvatar, HlmAvatarFallback, HlmAvatarImage } from '@spartan/helm/avatar';
import {
  lucideBell,
  lucideGlobe,
} from '@ng-icons/lucide';
import { TranslatePipe, LocaleService } from '@invento/core';
import { BrandLogo } from '@invento/shared';

@Component({
  selector: 'app-header',
  imports: [NgIcon, HlmButton, HlmBadge, HlmAvatar, HlmAvatarImage, HlmAvatarFallback, TranslatePipe, BrandLogo],
  providers: [
    provideIcons({
      lucideBell,
      lucideGlobe,
    }),
  ],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly localeService = inject(LocaleService);

  switchLocale(): void {
    const next = this.localeService.locale() === 'en' ? 'ar' : 'en';
    this.localeService.switchLocale(next);
  }
}
