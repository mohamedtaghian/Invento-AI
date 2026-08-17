import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmCardImports } from '@spartan/helm/card';
import { HlmButtonImports } from '@spartan/helm/button';
import { HlmSelectImports } from '@spartan/helm/select';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSparkles } from '@ng-icons/lucide';

import { StatCard } from './components/stat-card/stat-card';
import { RevenueChart } from './components/revenue-chart/revenue-chart';
import { TopSelling } from './components/top-selling/top-selling';
import { SalesCategory } from './components/sales-category/sales-category';
import { CustomerGrowth } from './components/customer-growth/customer-growth';
import { AnalyticsService, AnalyticsRange, AnalyticsResponse } from './services/analytics-service';
import { OrdersDonut } from './components/orders-donut/orders-donut';

import { lucideChevronRight } from '@ng-icons/lucide';
@Component({
  standalone: true,
  selector: 'app-analytics',
  imports: [
    RouterLink,
    NgIcon,
    HlmSelectImports,
    StatCard,
    RevenueChart,
    OrdersDonut,
    TopSelling,
    SalesCategory,
    CustomerGrowth,
    HlmCardImports,
    HlmButtonImports,
  ],
  providers: [provideIcons({ lucideSparkles, lucideChevronRight })],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Analytics {
  private analyticsService = inject(AnalyticsService);

  analytics = this.analyticsService.analytics;
  data = this.analyticsService.data as () => AnalyticsResponse | undefined;
  range = this.analyticsService.range;

  // reference imported standalone components so the template typechecker recognizes them
  // (they are used by selector in the template)
  private readonly __components = [TopSelling, SalesCategory, CustomerGrowth];

  onRangeChange(value: AnalyticsRange | null | undefined) {
    if (value) this.analyticsService.range.set(value);
  }
}
