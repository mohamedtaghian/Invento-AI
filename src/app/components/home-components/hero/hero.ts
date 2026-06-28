import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBolt, lucideCode } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan/helm/button';
import { HlmBadgeImports } from '@spartan/helm/badge';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgIcon, ...HlmButtonImports, ...HlmBadgeImports],
  providers: [provideIcons({ lucideBolt, lucideCode })],
})
export class Hero {}
