import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBolt } from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
import { ScrollAnimateDirective } from '@/app/shared/directives/scroll-animate.directive';
import { hlmH2, hlmP } from '@spartan/helm/typography';
import { TranslatePipe } from '@invento/core';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgIcon, HlmButton, ScrollAnimateDirective, TranslatePipe],
  providers: [provideIcons({ lucideBolt })],
})
export class Cta {
  protected readonly hlmH2 = hlmH2;
  protected readonly hlmP = hlmP;
}
