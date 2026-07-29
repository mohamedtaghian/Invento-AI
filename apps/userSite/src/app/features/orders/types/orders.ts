export type OrderStatus = 'processing' | 'in-transit' | 'delivered' | 'cancelled';

export type OrderFilter = 'all' | 'processing' | 'in-transit' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

export interface OrderTimelineStep {
  title: string;
  date?: string;
  completed: boolean;
  current?: boolean;
}

export interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: {
    type: string;
    last4?: string;
  };
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  timeline: OrderTimelineStep[];
}

export interface OrderStatusConfig {
  label: string;
  badgeClass: string;
  dotClass: string;
  icon: string;
}
