import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface Stat {
  readonly value: string;
  readonly label: string;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stats {
  protected readonly stats = signal<Stat[]>([
    { value: '6', label: 'Build Stages' },
    { value: '∞', label: 'Schema Types' },
    { value: '100%', label: 'AI-Generated' },
    { value: '<2min', label: 'Time to Deploy' },
  ]);
}
