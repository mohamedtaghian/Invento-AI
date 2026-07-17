import { Injectable, signal } from '@angular/core';
import { PRODUCTS } from '../mock/products';
import type { ProductDetail } from '../types/product';

@Injectable({ providedIn: 'root' })
export class ProductsData {
  private readonly _products = signal(PRODUCTS);

  readonly products = this._products.asReadonly();

  getProductById(id: string): ProductDetail | undefined {
    const product = this._products().find((p) => p.id === id);
    if (!product) return undefined;

    const images = Array.from({ length: 5 }, (_, i) => ({
      id: `img-${i + 1}`,
      src:
        i === 0 ? product.image : `https://picsum.photos/seed/${product.id}-view-${i + 1}/600/450`,
      alt: `${product.name} view ${i + 1}`,
    }));

    return {
      id: product.id,
      category: product.category,
      name: product.name,
      tagline: product.description,
      badge: product.badge,
      rating: product.rating ?? 4.5,
      reviewCount: 86,
      price: product.price,
      compareAtPrice: product.originalPrice,
      inStock: product.inStock,
      shippingNote: 'Ships within 24 hours',
      images,
      colors: [{ id: 'default', label: 'Default', hex: '#6b7280' }],
      sizes: [{ id: 'std', label: 'Standard' }],
      highlights: ['1 year warranty', 'Free shipping', '30-day returns'],
      shippingReturnsPolicy:
        'Free standard shipping on all orders. Returns accepted within 30 days of purchase.',
    };
  }
}
