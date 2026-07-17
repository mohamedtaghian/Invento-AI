import { Injectable, computed, signal } from '@angular/core';
import { PRODUCTS, DETAIL_PRODUCTS } from '../mock/products';
import type {
  ProductDetail,
  RecommendedProduct,
} from '@invento/user-site/app/features/product-details/types/product-detail.interface';

@Injectable({ providedIn: 'root' })
export class ProductsData {
  private readonly _products = signal(PRODUCTS);

  readonly products = this._products.asReadonly();

  private readonly _detailProducts = DETAIL_PRODUCTS;

  getProductById(id: string): ProductDetail | undefined {
    const detail = this._detailProducts.find((p) => p.id === id);
    if (detail) return detail;

    const product = this._products().find((p) => p.id === id);
    if (!product) return undefined;

    return {
      ...product,
      rating: 4.5,
      reviewCount: 86,
      images: [product.image],
      colors: [{ name: 'Default', hex: '#6b7280' }],
      sizes: [{ label: 'Standard', value: 'std' }],
      features: ['1 year warranty', 'Free shipping', '30-day returns'],
    };
  }

  readonly recommendedProducts = computed<RecommendedProduct[]>(() =>
    this._products()
      .slice(0, 4)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        rating: 4.8,
      })),
  );
}
