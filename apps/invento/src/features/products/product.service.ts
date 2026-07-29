// product.model.ts
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

import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Dusk Scented Candle Set',
      sku: 'LG-CAS-005',
      category: 'Wellness',
      price: 48.0,
      stock: 67,
      status: 'Active',
      date: '28 May 2025',
      imageUrl: 'assets/candle.png',
    },
    {
      id: '2',
      name: 'Cascade Matte Tumbler',
      sku: 'LG-TUM-006',
      category: 'Kitchenware',
      price: 34.0,
      stock: 0,
      status: 'Out of Stock',
      date: '18 Jun 2025',
      imageUrl: 'assets/tumbler.png',
    },
    {
      id: '3',
      name: 'Terrain Wool Rug 5x8',
      sku: 'LG-RUG-007',
      category: 'Textiles',
      price: 385.0,
      originalPrice: 460.0,
      discount: '16% off',
      stock: 6,
      stockWarning: '6 left',
      status: 'Active',
      date: '20 May 2025',
      imageUrl: 'assets/rug.png',
    },
    // Add more mock items here as needed
  ];

  getProducts(): Observable<Product[]> {
    // Simulate a 500ms network delay
    return of(this.mockProducts).pipe(delay(500));
  }
}
