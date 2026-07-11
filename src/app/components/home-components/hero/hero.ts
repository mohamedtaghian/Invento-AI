import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBolt, lucideCode } from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
import { HlmBadge } from '@spartan/helm/badge';
import { ScrollAnimateDirective } from '../../../shared/directives/scroll-animate.directive';
import { TypingText } from '../typing-text/typing-text';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgIcon, HlmButton, HlmBadge, ScrollAnimateDirective, TypingText],
  providers: [provideIcons({ lucideBolt, lucideCode })],
})
export class Hero {
  protected readonly typingWords = [
    'Your Business',
    'Your Brand',
    'Your Store',
    'Your Vision',
    'Your Future',
  ];
}
