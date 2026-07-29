export interface Order {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerName: string;
  customerEmail?: string;
  paymentStatus?: 'paid' | 'unpaid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}
