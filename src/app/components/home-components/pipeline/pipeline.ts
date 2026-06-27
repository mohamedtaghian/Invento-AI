import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmCardImports } from '@spartan/helm/card';
import { HlmBadgeImports } from '@spartan/helm/badge';

interface PipelineStep {
  readonly number: string;
  readonly title: string;
  readonly subtitle: string;
  readonly route: string;
}

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ...HlmCardImports, ...HlmBadgeImports],
})
export class Pipeline {
  protected readonly steps = signal<PipelineStep[]>([
    { number: '01', title: 'Brainstorm', subtitle: 'Raw business concept', route: '/brain' },
    { number: '02', title: 'AI Interview', subtitle: 'Schema extraction', route: '/ai-builder' },
    { number: '03', title: 'Validation', subtitle: 'Name availability', route: '/validation' },
    { number: '04', title: 'Preview', subtitle: 'Deploy site', route: '/preview' },
  ]);
}
