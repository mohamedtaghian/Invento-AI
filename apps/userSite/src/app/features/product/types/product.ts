export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly originalPrice?: number;
  readonly image: string;
  readonly category: string;
  readonly color: string;
  readonly badge?: string;
  readonly inStock: boolean;
  readonly discount?: number;
  readonly rating?: number;
}

export type SortOption = 'recommended' | 'best-seller' | 'price-asc' | 'price-desc' | 'newest';

export interface ProductImage {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
}

export interface ColorOption {
  readonly id: string;
  readonly label: string;
  readonly hex: string;
}

export interface SizeOption {
  readonly id: string;
  readonly label: string;
}

export interface ProductDetail {
  readonly id: string;
  readonly category: string;
  readonly name: string;
  readonly tagline: string;
  readonly badge?: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly price: number;
  readonly compareAtPrice?: number;
  readonly inStock: boolean;
  readonly shippingNote: string;
  readonly images: readonly ProductImage[];
  readonly colors: readonly ColorOption[];
  readonly sizes: readonly SizeOption[];
  readonly highlights: readonly string[];
  readonly shippingReturnsPolicy: string;
}
