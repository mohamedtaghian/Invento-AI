import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HlmButtonImports } from '@spartan/helm/button';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideCircleCheck,
  lucideClock,
  lucideCircleX,
  lucideTruck,
  lucideCalendar,
  lucideRotateCcw,
  lucideDownload,
  lucideChevronDown,
  lucideMapPin,
  lucideCreditCard,
  lucideCopy,
} from '@ng-icons/lucide';
import { OrdersDataService } from '../../service/orders-data.service';
import type { OrderHistoryItem, OrderStatusConfig } from '../../types/orders';

@Component({
  selector: 'app-order-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CurrencyPipe, HlmButtonImports, NgIconComponent],
  providers: [
    provideIcons({
      lucideCircleCheck,
      lucideClock,
      lucideCircleX,
      lucideTruck,
      lucideCalendar,
      lucideRotateCcw,
      lucideDownload,
      lucideChevronDown,
      lucideMapPin,
      lucideCreditCard,
      lucideCopy,
    }),
  ],
  templateUrl: './order-card.html',
  styleUrl: './order-card.css',
})
export class OrderCardComponent {
  readonly order = input.required<OrderHistoryItem>();

  protected readonly ordersService = inject(OrdersDataService);
  protected readonly copiedTracking = signal<string | null>(null);

  protected getStatusConfig(status: OrderHistoryItem['status']): OrderStatusConfig {
    return this.ordersService.getStatusConfig(status);
  }

  protected copyTracking(trackingNumber?: string): void {
    if (!trackingNumber) return;
    navigator.clipboard.writeText(trackingNumber);
    this.copiedTracking.set(trackingNumber);
    setTimeout(() => {
      this.copiedTracking.set(null);
    }, 2000);
  }

  protected downloadInvoice(orderNumber: string): void {
    // TODO: When integrating your toast library, trigger an info toast here:
    // e.g., this.toast.info(`Downloading invoice for ${orderNumber}...`);
    console.info(`Downloading invoice for ${orderNumber}...`);
  }

  protected reorder(orderNumber: string): void {
    // TODO: When cart backend is ready, dispatch add-to-cart API request & trigger toast:
    // e.g., this.toast.success(`Items from ${orderNumber} added to your cart!`);
    console.info(`Reordering items from ${orderNumber}...`);
  }

  protected async cancelOrder(orderId: string, orderNumber: string): Promise<void> {
    const success = await this.ordersService.cancelOrder(orderId);
    if (success) {
      // TODO: When integrating your toast library, trigger a notification here:
      // e.g., this.toast.info(`Order ${orderNumber} has been cancelled.`);
      console.info(`Order ${orderNumber} cancelled.`);
    }
  }
}
