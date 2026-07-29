import { Component, ElementRef, afterNextRender, input, viewChild, computed } from '@angular/core';
import type { Chart } from 'chart.js';

export interface StatusSlice {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-orders-donut',
  imports: [],
  templateUrl: './orders-donut.html',
})
export class OrdersDonut {
  data = input.required<StatusSlice[]>();

  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart?: Chart;

  private labels = computed(() => this.data().map((d) => d.label));
  private values = computed(() => this.data().map((d) => d.value));
  private colors = computed(() => this.data().map((d) => d.color));

  constructor() {
    afterNextRender(async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      this.chart = new Chart(this.canvasRef().nativeElement, {
        type: 'doughnut',
        data: {
          labels: this.labels(),
          datasets: [
            {
              data: this.values(),
              backgroundColor: this.colors(),
              borderWidth: 0,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: { display: false }, // we render our own legend list above
            tooltip: { enabled: true },
          },
        },
      });
    });
  }
}
