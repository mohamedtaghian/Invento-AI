import { Injectable, signal } from '@angular/core';
import { Product } from './product.interface';

@Injectable({ providedIn: 'root' })
export class ProductStore {
  readonly products = signal<Product[]>([]);
  readonly selectedProduct = signal<Product | null>(null);
}
