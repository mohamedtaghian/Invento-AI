import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface Capability {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-capabilities',
  templateUrl: './capabilities.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Capabilities {
  protected readonly capabilities = signal<Capability[]>([
    {
      icon: '>_',
      title: 'AI Interview Engine',
      description:
        'Threaded questionnaire that streams questions progressively as you answer, extracting your business schema.',
    },
    {
      icon: '≡',
      title: 'Emotion → CSS Variables',
      description:
        'Select a brand archetype and watch CSS variables update live in a split-screen variable bridge.',
    },
    {
      icon: '⊟',
      title: 'Product Schema Builder',
      description:
        'Spartan-compatible schema editor with size matrices, SKU validation, and custom properties.',
    },
    {
      icon: '⊕',
      title: 'Ghost Site Preview',
      description:
        'Iframe-style preview showing Spartan components reacting to generated CSS variables in real-time.',
    },
  ]);
}
