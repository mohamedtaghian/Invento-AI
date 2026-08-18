import { EmptyState } from '@invento/shared';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideDownload,
  lucideSearch,
  lucideFilter,
  lucideCalendar,
  lucideChevronRight,
  lucideMoreHorizontal,
  lucideEye,
  lucideCheckCircle2,
  lucideXCircle,
  lucideClock,
  lucideRefreshCw,
  lucideShoppingCart,
  lucideChevronLeft,
  lucideChevronsLeft,
  lucideChevronsRight,
  lucideTrendingUp,
  lucideTrendingDown,
  lucideMinus,
  lucideTruck,
  lucideX,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
import { HlmCardImports } from '@spartan/helm/card';
import { HlmInputImports } from '@spartan/helm/input';
import { OrderStatCard } from './components/order-stat-card';
import { TranslatePipe } from '@invento/core';
import { OrderStore, type Order } from '@invento/invento/entities/order';

@Component({
  selector: 'app-orders',
  imports: [
    CurrencyPipe,
    NgIcon,
    HlmButton,
    HlmCardImports,
    HlmInputImports,
    OrderStatCard,
    EmptyState,
    TranslatePipe,
  ],
  providers: [
    provideIcons({
      lucideDownload,
      lucideSearch,
      lucideFilter,
      lucideCalendar,
      lucideChevronRight,
      lucideMoreHorizontal,
      lucideEye,
      lucideCheckCircle2,
      lucideXCircle,
      lucideClock,
      lucideRefreshCw,
      lucideShoppingCart,
      lucideChevronLeft,
      lucideChevronsLeft,
      lucideChevronsRight,
      lucideTrendingUp,
      lucideTrendingDown,
      lucideMinus,
      lucideTruck,
      lucideX,
    }),
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Orders {
  readonly store = inject(OrderStore);

  readonly activeDropdownId = signal<string | null>(null);
  readonly selectedDetailOrder = signal<Order | null>(null);

  readonly pageRangeStart = computed(() => {
    if (this.store.totalOrdersCount() === 0) return 0;
    return (this.store.currentPage() - 1) * this.store.rowsPerPage() + 1;
  });

  readonly pageRangeEnd = computed(() => {
    return Math.min(
      this.store.currentPage() * this.store.rowsPerPage(),
      this.store.totalOrdersCount(),
    );
  });

  readonly pageNumbers = computed(() => {
    const total = this.store.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.store.setSearchQuery(target.value);
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.store.setStatusFilter(target.value);
  }

  onTimeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.store.setTimeFilter(target.value);
  }

  onRowsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.store.setRowsPerPage(Number(target.value));
  }

  toggleRowMenu(orderId: string, event: Event): void {
    event.stopPropagation();
    if (this.activeDropdownId() === orderId) {
      this.activeDropdownId.set(null);
    } else {
      this.activeDropdownId.set(orderId);
    }
  }

  @HostListener('document:click')
  closeRowMenu(): void {
    this.activeDropdownId.set(null);
  }

  updateStatus(orderId: string, status: Order['status'], event?: Event): void {
    event?.stopPropagation();
    this.store.updateOrderStatus(orderId, status);
    this.closeRowMenu();
    if (this.selectedDetailOrder()?.id === orderId) {
      const updated = this.store.orders().find((o) => o.id === orderId) ?? null;
      this.selectedDetailOrder.set(updated);
    }
  }

  viewDetails(order: Order, event?: Event): void {
    event?.stopPropagation();
    this.selectedDetailOrder.set(order);
    this.closeRowMenu();
  }

  closeDetails(): void {
    this.selectedDetailOrder.set(null);
  }

  resetFilters(): void {
    this.store.setSearchQuery('');
    this.store.setStatusFilter('all');
    this.store.setTimeFilter('all_time');
  }

  getDatePart(dateString: string): string {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString.split('T')[0] ?? dateString;
    }
  }

  getTimePart(dateString: string): string {
    try {
      const d = new Date(dateString);
      return d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return dateString.split('T')[1]?.slice(0, 5) ?? '';
    }
  }

  getFulfillmentBadgeClass(status: string): string {
    switch (status) {
      case 'cancelled':
        return 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60 font-medium';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60 font-medium';
      case 'shipped':
        return 'bg-sky-50 text-sky-600 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/60 font-medium';
      case 'processing':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/60 font-medium';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60 font-medium';
    }
  }
}
