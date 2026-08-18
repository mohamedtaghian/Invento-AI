import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FilterTabs, SearchInput, type FilterTab } from '@invento/shared';
import { LocaleService, TranslatePipe } from '@invento/core';
import { OrdersDataService } from '../../service/orders-data.service';
import type { OrderFilter } from '../../types/orders';

const ORDER_FILTER_IDS: readonly OrderFilter[] = [
  'all',
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

@Component({
  selector: 'app-orders-filter-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilterTabs, SearchInput, TranslatePipe],
  templateUrl: './orders-filter-bar.html',
})
export class OrdersFilterBarComponent {
  protected readonly ordersService = inject(OrdersDataService);
  // Tab labels are data, not template text, so they are translated here rather than by the pipe.
  private readonly locale = inject(LocaleService);

  protected readonly tabs = computed<FilterTab<OrderFilter>[]>(() => {
    const counts = this.ordersService.statusCounts();
    this.locale.locale(); // re-compute labels when the language changes
    return ORDER_FILTER_IDS.map((id) => ({
      id,
      label: this.locale.translate(`orders.filters.${id}`),
      count: counts[id],
    }));
  });

  protected onFilterChange(filter: OrderFilter): void {
    this.ordersService.setFilter(filter);
  }

  protected onSearchChange(query: string): void {
    this.ordersService.setSearchQuery(query);
  }
}
