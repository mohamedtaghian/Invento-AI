export type RecommendationUrgency = 'critical' | 'watch' | 'ok';
export type RecommendationType = 'restock' | 'overstock';

export interface RestockRecommendation {
  id: string;
  productName: string;
  sku: string;
  imageUrl?: string;
  stockCount: number;
  soldLast30d: number;
  urgency: RecommendationUrgency;
  type: RecommendationType;
  description: string;
  suggestion: string; // e.g. "Reorder 60 units from Verdant Co. — standard lead time is 7 days."
  productUrl: string;
}
