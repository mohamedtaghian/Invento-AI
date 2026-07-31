// apps/invento/src/pages/products/product.model.ts
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: 'Active' | 'Draft' | 'Out of Stock' | 'Archived';
  date: string;
  imageUrl: string;
  discount?: string;
  stockWarning?: string;
}
