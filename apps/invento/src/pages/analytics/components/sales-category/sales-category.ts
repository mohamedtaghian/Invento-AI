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
  selector: 'app-sales-category',
  imports: [],
  templateUrl: './sales-category.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesCategory {
  labels = input.required<string[]>();
  data = input.required<number[]>();

  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart?: Chart;

  constructor() {
    afterNextRender(async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      this.chart = new Chart(this.canvasRef().nativeElement, {
        type: 'bar',
        data: {
          labels: this.labels(),
          datasets: [
            {
              data: this.data(),
              backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#38bdf8', '#f472b6', '#a78bfa'],
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        },
      });
    });
  }
}
