import { Component, input } from '@angular/core';
import { HlmCardImports } from '@spartan/helm/card';
import { HlmBadgeImports } from '@spartan/helm/badge';
import { Sparkline } from '../sparkline/sparkline';

@Component({
  selector: 'app-stat-card',
  imports: [Sparkline, HlmCardImports, HlmBadgeImports],
  templateUrl: './stat-card.html',
})
export class StatCard {
  label = input.required<string>();
  value = input.required<string>();
  change = input.required<number>();
  trend = input.required<number[]>();
  color = input<string>('#6366f1');
}
