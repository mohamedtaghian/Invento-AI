import { Component, input, InputSignal } from '@angular/core';
import { HlmBadgeImports } from '@spartan/helm/badge';

@Component({
  selector: 'app-page-badge',
  imports: [HlmBadgeImports],
  templateUrl: './page-badge.html',
  styleUrl: './page-badge.css',
})
export class PageBadge {
  badgeText: InputSignal<string> = input<string>('Coming Soon');

  glowColor: InputSignal<string> = input<string>('var(--primary)');
  animationSpeed: InputSignal<string> = input<string>('3s');
}
