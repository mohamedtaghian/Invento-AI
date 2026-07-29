import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  input,
  viewChild,
} from '@angular/core';
import type { Chart } from 'chart.js';

@Component({
  standalone: true,
  selector: 'app-customer-growth',
  imports: [],
  templateUrl: './customer-growth.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerGrowth {
  labels = input.required<string[]>();
  newData = input.required<number[]>();
  returningData = input.required<number[]>();

  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart?: Chart;

  constructor() {
    afterNextRender(async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      this.chart = new Chart(this.canvasRef().nativeElement, {
        type: 'line',
        data: {
          labels: this.labels(),
          datasets: [
            {
              label: 'New',
              data: this.newData(),
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99,102,241,0.06)',
              tension: 0.35,
              pointRadius: 3,
            },
            {
              label: 'Returning',
              data: this.returningData(),
              borderColor: '#10b981',
              backgroundColor: 'rgba(16,185,129,0.04)',
              tension: 0.35,
              pointRadius: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: true, position: 'top' } },
          scales: { y: { beginAtZero: true } },
        },
      });
    });
  }
}
