import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface PipelineStep {
  readonly number: string;
  readonly title: string;
  readonly subtitle: string;
}

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pipeline {
  protected readonly steps = signal<PipelineStep[]>([
    { number: '01', title: 'Brainstorm', subtitle: 'Raw business concept' },
    { number: '02', title: 'AI Interview', subtitle: 'Schema extraction' },
    { number: '03', title: 'Brand Theme', subtitle: 'Emotion → variables' },
    { number: '04', title: 'Validation', subtitle: 'Name availability' },
    { number: '05', title: 'Products', subtitle: 'Schema definition' },
    { number: '06', title: 'Preview', subtitle: 'Deploy site' },
  ]);
}
