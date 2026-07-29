import { Injectable, computed, signal } from '@angular/core';
import { Order } from './order.interface';

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-4818',
    productId: 'PRD-101',
    quantity: 1,
    totalPrice: 385.0,
    status: 'cancelled',
    customerName: 'Ravi Krishnamurthy',
    customerEmail: 'ravi.k@hotmail.com',
    paymentStatus: 'paid',
    createdAt: '2025-06-18T14:07:00Z',
    updatedAt: '2025-06-18T14:07:00Z',
  },
  {
    id: 'ORD-4821',
    productId: 'PRD-102',
    quantity: 2,
    totalPrice: 202.95,
    status: 'delivered',
    customerName: 'Elara Montoya',
    customerEmail: 'elara.montoya@gmail.com',
    paymentStatus: 'paid',
    createdAt: '2025-06-15T09:42:00Z',
    updatedAt: '2025-06-15T09:42:00Z',
  },
  {
    id: 'ORD-4810',
    productId: 'PRD-103',
    quantity: 3,
    totalPrice: 1250.5,
    status: 'shipped',
    customerName: 'Priya Nair',
    customerEmail: 'priya.nair@outlook.com',
    paymentStatus: 'paid',
    createdAt: '2025-06-14T16:20:00Z',
    updatedAt: '2025-06-14T16:20:00Z',
  },
  {
    id: 'ORD-4809',
    productId: 'PRD-104',
    quantity: 1,
    totalPrice: 95.0,
    status: 'delivered',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@company.com',
    paymentStatus: 'paid',
    createdAt: '2025-06-12T11:15:00Z',
    updatedAt: '2025-06-12T11:15:00Z',
  },
  {
    id: 'ORD-4805',
    productId: 'PRD-105',
    quantity: 4,
    totalPrice: 640.0,
    status: 'processing',
    customerName: 'Sophia Chen',
    customerEmail: 'sophia.chen@tech.io',
    paymentStatus: 'paid',
    createdAt: '2025-06-10T15:30:00Z',
    updatedAt: '2025-06-10T15:30:00Z',
  },
  {
    id: 'ORD-4801',
    productId: 'PRD-106',
    quantity: 2,
    totalPrice: 310.0,
    status: 'delivered',
    customerName: "Liam O'Connor",
    customerEmail: 'liam.oc@gmail.com',
    paymentStatus: 'paid',
    createdAt: '2025-06-08T10:05:00Z',
    updatedAt: '2025-06-08T10:05:00Z',
  },
  {
    id: 'ORD-4798',
    productId: 'PRD-107',
    quantity: 1,
    totalPrice: 150.0,
    status: 'delivered',
    customerName: 'Amira Al-Hassan',
    customerEmail: 'amira.hassan@domain.com',
    paymentStatus: 'paid',
    createdAt: '2025-06-05T13:45:00Z',
    updatedAt: '2025-06-05T13:45:00Z',
  },
  {
    id: 'ORD-4795',
    productId: 'PRD-108',
    quantity: 5,
    totalPrice: 890.0,
    status: 'pending',
    customerName: 'David Kim',
    customerEmail: 'david.kim@studio.kr',
    paymentStatus: 'paid',
    createdAt: '2025-06-03T08:20:00Z',
    updatedAt: '2025-06-03T08:20:00Z',
  },
  {
    id: 'ORD-4792',
    productId: 'PRD-109',
    quantity: 2,
    totalPrice: 420.0,
    status: 'delivered',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@mail.com',
    paymentStatus: 'paid',
    createdAt: '2025-06-01T17:10:00Z',
    updatedAt: '2025-06-01T17:10:00Z',
  },
  {
    id: 'ORD-4789',
    productId: 'PRD-110',
    quantity: 1,
    totalPrice: 75.0,
    status: 'delivered',
    customerName: 'Noah Williams',
    customerEmail: 'noah.w@enterprise.org',
    paymentStatus: 'paid',
    createdAt: '2025-05-28T12:00:00Z',
    updatedAt: '2025-05-28T12:00:00Z',
  },
  {
    id: 'ORD-4785',
    productId: 'PRD-111',
    quantity: 3,
    totalPrice: 530.0,
    status: 'processing',
    customerName: 'Zara Patel',
    customerEmail: 'zara.p@agency.co',
    paymentStatus: 'paid',
    createdAt: '2025-05-25T14:50:00Z',
    updatedAt: '2025-05-25T14:50:00Z',
  },
  {
    id: 'ORD-4780',
    productId: 'PRD-112',
    quantity: 2,
    totalPrice: 260.0,
    status: 'cancelled',
    customerName: 'Carlos Mendez',
    customerEmail: 'carlos.m@consulting.es',
    paymentStatus: 'paid',
    createdAt: '2025-05-22T09:15:00Z',
    updatedAt: '2025-05-22T09:15:00Z',
  },
];

@Injectable({ providedIn: 'root' })
export class OrderStore {
  readonly orders = signal<Order[]>(INITIAL_ORDERS);
  readonly selectedOrder = signal<Order | null>(null);

  readonly searchQuery = signal<string>('');
  readonly statusFilter = signal<string>('all');
  readonly timeFilter = signal<string>('all_time');
  readonly currentPage = signal<number>(1);
  readonly rowsPerPage = signal<number>(10);
  readonly selectedOrderIds = signal<Set<string>>(new Set());

  readonly stats = computed(() => {
    const list = this.orders();
    return {
      total: list.length,
      pending: list.filter((o) => o.status === 'pending').length,
      processing: list.filter((o) => o.status === 'processing').length,
      delivered: list.filter((o) => o.status === 'delivered').length,
      cancelled: list.filter((o) => o.status === 'cancelled').length,
      shipped: list.filter((o) => o.status === 'shipped').length,
    };
  });

  readonly filteredOrders = computed(() => {
    const list = this.orders();
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();

    return list.filter((order) => {
      const matchesQuery =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(query));

      const matchesStatus = status === 'all' || order.status === status;

      return matchesQuery && matchesStatus;
    });
  });

  readonly totalOrdersCount = computed(() => this.filteredOrders().length);

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalOrdersCount() / this.rowsPerPage())),
  );

  readonly paginatedOrders = computed(() => {
    const filtered = this.filteredOrders();
    const start = (this.currentPage() - 1) * this.rowsPerPage();
    return filtered.slice(start, start + this.rowsPerPage());
  });

  readonly isAllCurrentPageSelected = computed(() => {
    const current = this.paginatedOrders();
    if (current.length === 0) return false;
    const selected = this.selectedOrderIds();
    return current.every((o) => selected.has(o.id));
  });

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  setStatusFilter(status: string): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
  }

  setTimeFilter(timeframe: string): void {
    this.timeFilter.set(timeframe);
    this.currentPage.set(1);
  }

  setPage(page: number): void {
    const validPage = Math.max(1, Math.min(page, this.totalPages()));
    this.currentPage.set(validPage);
  }

  setRowsPerPage(rows: number): void {
    this.rowsPerPage.set(rows);
    this.currentPage.set(1);
  }

  toggleSelectOrder(id: string): void {
    const current = new Set(this.selectedOrderIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedOrderIds.set(current);
  }

  toggleSelectAll(): void {
    const current = this.paginatedOrders();
    const selected = new Set(this.selectedOrderIds());
    const allSelected = this.isAllCurrentPageSelected();

    if (allSelected) {
      current.forEach((o) => selected.delete(o.id));
    } else {
      current.forEach((o) => selected.add(o.id));
    }
    this.selectedOrderIds.set(selected);
  }

  clearSelection(): void {
    this.selectedOrderIds.set(new Set());
  }

  updateOrderStatus(id: string, newStatus: Order['status']): void {
    this.orders.update((list) =>
      list.map((order) =>
        order.id === id
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order,
      ),
    );
  }

  deleteOrder(id: string): void {
    this.orders.update((list) => list.filter((order) => order.id !== id));
    this.selectedOrderIds.update((set) => {
      const next = new Set(set);
      next.delete(id);
      return next;
    });
  }

  exportOrders(): void {
    const list = this.filteredOrders();
    if (!list.length) return;

    const headers = [
      'Order ID',
      'Customer Name',
      'Email',
      'Date',
      'Items',
      'Total ($)',
      'Payment',
      'Status',
    ];
    const rows = list.map((o) => [
      o.id,
      `"${o.customerName}"`,
      o.customerEmail ?? '',
      o.createdAt,
      o.quantity.toString(),
      o.totalPrice.toFixed(2),
      o.paymentStatus ?? 'paid',
      o.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
