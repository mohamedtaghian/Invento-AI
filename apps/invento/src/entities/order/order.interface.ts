export interface Order {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerName: string;
  createdAt: string;
  updatedAt: string;
}
