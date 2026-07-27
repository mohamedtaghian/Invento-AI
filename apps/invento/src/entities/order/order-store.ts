import { Injectable, signal } from '@angular/core';
import { Order } from './order.interface';

@Injectable({ providedIn: 'root' })
export class OrderStore {
  readonly orders = signal<Order[]>([]);
  readonly selectedOrder = signal<Order | null>(null);
}
