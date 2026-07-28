import { Component, ElementRef, afterNextRender, input, viewChild } from '@angular/core';
import { resolveCssColor } from '@invento/invento/shared/resolve-css-color';
import type { Chart } from 'chart.js';

@Component({
  selector: 'app-revenue-chart',
  imports: [],
  templateUrl: './revenue-chart.html',
})
export class RevenueChart {
  data = input.required<number[]>();
  labels = input.required<string[]>();
  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart?: Chart;

  constructor() {
    // afterNextRender never runs on the server — safe place for canvas/Chart.js
    afterNextRender(async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      const lineColor = resolveCssColor('var(--primary)');
      const fillColor = resolveCssColor('var(--primary)').replace(')', ' / 0.12)');

      this.chart = new Chart(this.canvasRef().nativeElement, {
        type: 'line',
        data: {
          labels: this.labels(),
          datasets: [
            {
              data: this.data(),
              borderColor: lineColor,
              backgroundColor: fillColor,
              fill: true,
              tension: 0.35,
              pointRadius: 0,
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
