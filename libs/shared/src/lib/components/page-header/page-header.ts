import { Component, input, InputSignal } from '@angular/core';
import { PageBadge } from '../page-badge/page-badge';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-page-header',
  imports: [PageBadge, ScrollAnimateDirective],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  // Configurable badge options (forwarded down to app-page-badge)
  badgeText: InputSignal<string> = input<string>('STEP 01');
  animationSpeed: InputSignal<string> = input<string>('2s');
  glowColor: InputSignal<string> = input<string>('var(--primary)');

  // Dynamic Text Inputs for Header Body
  title: InputSignal<string> = input<string>('Site');
  accentTitle: InputSignal<string> = input<string>('Preview');
  description: InputSignal<string> = input<string>('');
}
