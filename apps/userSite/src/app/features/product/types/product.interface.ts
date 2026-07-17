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
}

export type SortOption = 'recommended' | 'best-seller' | 'price-asc' | 'price-desc' | 'newest';
