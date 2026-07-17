import type { Product } from '@invento/user-site/app/features/product/types/product.interface';

export interface ProductDetail extends Product {
  readonly rating: number;
  readonly reviewCount: number;
  readonly images: string[];
  readonly colors: ProductColor[];
  readonly sizes: ProductSize[];
  readonly features: string[];
}

export interface ProductColor {
  readonly name: string;
  readonly hex: string;
}

export interface ProductSize {
  readonly label: string;
  readonly value: string;
}

export interface RecommendedProduct {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly image: string;
  readonly category: string;
  readonly rating: number;
}
