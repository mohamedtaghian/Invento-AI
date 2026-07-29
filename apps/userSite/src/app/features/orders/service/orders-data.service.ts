import { Injectable, computed, signal } from '@angular/core';
import type { OrderFilter, OrderHistoryItem, OrderStatusConfig } from '../types/orders';
import { MOCK_ORDERS } from '../mock/orders-data';

@Injectable({
  providedIn: 'root',
})
export class OrdersDataService {
  private readonly _orders = signal<OrderHistoryItem[]>(MOCK_ORDERS);
  private readonly _selectedFilter = signal<OrderFilter>('all');
  private readonly _searchQuery = signal<string>('');
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly orders = this._orders.asReadonly();
  readonly selectedFilter = this._selectedFilter.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly filteredOrders = computed(() => {
    const filter = this._selectedFilter();
    const query = this._searchQuery().trim().toLowerCase();

    return this._orders().filter((order) => {
      const matchesFilter = filter === 'all' || order.status === filter;
      if (!matchesFilter) return false;

      if (!query) return true;

      const matchesOrderNumber = order.orderNumber.toLowerCase().includes(query);
      const matchesItemName = order.items.some((item) => item.name.toLowerCase().includes(query));

      return matchesOrderNumber || matchesItemName;
    });
  });

  readonly statusCounts = computed(() => {
    const orders = this._orders();
    return {
      all: orders.length,
      processing: orders.filter((o) => o.status === 'processing').length,
      'in-transit': orders.filter((o) => o.status === 'in-transit').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  });

  readonly totalSpent = computed(() => {
    return this._orders()
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  });

  /**
   * TODO: BACKEND INTEGRATION
   * Once backend API is ready:
   * 1. Inject HttpClient: private http = inject(HttpClient);
   * 2. Replace local MOCK_ORDERS with API call:
   *    const data = await firstValueFrom(this.http.get<OrderHistoryItem[]>('/api/orders'));
   *    this._orders.set(data);
   */
  async loadOrders(): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      // TODO: Replace with real HTTP request when server endpoint is ready
      this._orders.set(MOCK_ORDERS);
    } catch (err: unknown) {
      console.log(err);
      this._error.set('Failed to fetch orders from server.');
    } finally {
      this._isLoading.set(false);
    }
  }

  setFilter(filter: OrderFilter): void {
    this._selectedFilter.set(filter);
  }

  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  /**
   * TODO: BACKEND INTEGRATION
   * Send cancel request to API:
   *   await firstValueFrom(this.http.patch(`/api/orders/${orderId}/cancel`, {}));
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    const order = this._orders().find((o) => o.id === orderId);
    if (!order || order.status !== 'processing') {
      return false;
    }

    try {
      // TODO: Perform actual backend PATCH request here when API is ready
      this._orders.update((list) =>
        list.map((item) =>
          item.id === orderId
            ? {
                ...item,
                status: 'cancelled' as const,
                timeline: [
                  ...item.timeline.map((t) => ({ ...t, current: false })),
                  {
                    title: 'Cancelled by Customer',
                    date: 'Just now',
                    completed: true,
                    current: true,
                  },
                ],
              }
            : item,
        ),
      );

      return true;
    } catch {
      this._error.set('Could not cancel order on server.');
      return false;
    }
  }

  getStatusConfig(status: OrderHistoryItem['status']): OrderStatusConfig {
    switch (status) {
      case 'delivered':
        return {
          label: 'Delivered',
          badgeClass:
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
          dotClass: 'bg-emerald-500',
          icon: 'lucideCircleCheck',
        };
      case 'in-transit':
        return {
          label: 'In Transit',
          badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
          dotClass: 'bg-blue-500 animate-pulse',
          icon: 'lucideTruck',
        };
      case 'processing':
        return {
          label: 'Processing',
          badgeClass:
            'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
          dotClass: 'bg-amber-500 animate-pulse',
          icon: 'lucideClock',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
          dotClass: 'bg-rose-500',
          icon: 'lucideCircleX',
        };
    }
  }
}
