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
  selector: 'app-top-selling',
  imports: [],
  templateUrl: './top-selling.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopSelling {
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
              backgroundColor: '#6366f1',
              borderRadius: 8,
              barThickness: 12,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true }, y: { ticks: { autoSkip: false } } },
        },
      });
    });
  }
}
