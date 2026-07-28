import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-sparkline',
  imports: [],
  templateUrl: './sparkline.html',
})
export class Sparkline {
  data = input.required<number[]>();
  color = input<string>('#6366f1');

  private points = computed(() => {
    const d = this.data();
    const min = Math.min(...d),
      max = Math.max(...d) || 1;
    return d.map((v, i) => {
      const x = (i / (d.length - 1)) * 100;
      const y = 30 - ((v - min) / (max - min || 1)) * 28 - 1;
      return `${x},${y}`;
    });
  });

  linePath = computed(() => `M ${this.points().join(' L ')}`);
  areaPath = computed(() => `M ${this.points().join(' L ')} L 100,30 L 0,30 Z`);
}
