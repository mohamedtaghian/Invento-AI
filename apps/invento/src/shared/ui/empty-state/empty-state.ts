import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmCard, HlmCardContent } from '@spartan/helm/card';
import { HlmButton } from '@spartan/helm/button';
import { lucideInbox } from '@ng-icons/lucide';


@Component({
  selector: 'app-empty-state',
  imports: [NgIcon, HlmCard, HlmCardContent, HlmButton],
  providers: [provideIcons({ lucideInbox })],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  readonly icon = input<string>('lucideInbox');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly actionLabel = input<string>();
  readonly actionClick = output<void>();
}
