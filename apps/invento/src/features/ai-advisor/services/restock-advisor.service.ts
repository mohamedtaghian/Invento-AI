// restock-advisor.service.ts
import { Injectable, computed, signal, resource } from '@angular/core';
import {
  RestockRecommendation,
  RecommendationType,
} from '@invento/invento/shared/ai-advisor.types';

const MOCK_RECOMMENDATIONS: RestockRecommendation[] = [
  {
    id: '1',
    productName: 'Atlas Brass Candleholder',
    sku: 'LG-CND-003',
    stockCount: 5,
    soldLast30d: 38,
    urgency: 'critical',
    type: 'restock',
    description:
      "Only 5 units left with a 30-day sell-through of 38. At current velocity you'll stock out in roughly 4 days.",
    suggestion: 'Reorder 60 units from Verdant Co. — standard lead time is 7 days.',
    productUrl: '/products/lg-cnd-003',
  },
  {
    id: '2',
    productName: 'Terrain Wool Rug 5x8',
    sku: 'LG-RUG-007',
    stockCount: 6,
    soldLast30d: 28,
    urgency: 'critical',
    type: 'restock',
    description:
      '6 units remaining; sold 28 last month. This is your highest-revenue SKU — a stockout would significantly impact monthly revenue.',
    suggestion: 'Reorder 30 units from Threadline Mills. Allow 14-day lead time.',
    productUrl: '/products/lg-rug-007',
  },
  {
    id: '3',
    productName: 'Nordic Pine Side Table',
    sku: 'LG-TBL-014',
    stockCount: 84,
    soldLast30d: 6,
    urgency: 'watch',
    type: 'overstock',
    description:
      '84 units on hand against only 6 sold in the last 30 days. Consider a promotion to free up warehouse space.',
    suggestion: 'Run a 15% off promotion or bundle with a complementary SKU.',
    productUrl: '/products/lg-tbl-014',
  },
  {
    id: '4',
    productName: 'Solstice Ceramic Vase',
    sku: 'LG-VAS-021',
    stockCount: 8,
    soldLast30d: 19,
    urgency: 'watch',
    type: 'restock',
    description: '8 units left with steady demand. Not urgent yet, but worth queuing a reorder.',
    suggestion: 'Reorder 25 units from Hearth & Kiln Co. Lead time is 10 days.',
    productUrl: '/products/lg-vas-021',
  },
  {
    id: '5',
    productName: 'Woven Rattan Basket Set',
    sku: 'LG-BSK-009',
    stockCount: 120,
    soldLast30d: 4,
    urgency: 'watch',
    type: 'overstock',
    description:
      'Very slow mover — 120 units on hand vs. 4 sold in 30 days. Ties up significant capital.',
    suggestion: 'Consider a clearance bundle or discontinuing the SKU next season.',
    productUrl: '/products/lg-bsk-009',
  },
  {
    id: '6',
    productName: 'Ember Linen Throw Pillow',
    sku: 'LG-PIL-045',
    stockCount: 11,
    soldLast30d: 22,
    urgency: 'ok',
    type: 'restock',
    description:
      'Healthy stock relative to sell-through, but trending up. Worth a proactive reorder.',
    suggestion: 'Reorder 20 units from Fieldstone Textiles when convenient. Lead time is 5 days.',
    productUrl: '/products/lg-pil-045',
  },
];

export type RecommendationFilter = 'all' | RecommendationType;

@Injectable({ providedIn: 'root' })
export class RestockAdvisorService {
  filter = signal<RecommendationFilter>('all');

  // same resource() pattern as AnalyticsService — swap the loader for a real
  // fetch later and nothing downstream (component/template) needs to change
  recommendations = resource({
    params: () => ({ filter: this.filter() }),
    loader: async ({ params }) => {
      await new Promise((r) => setTimeout(r, 300)); // simulated latency

      const items =
        params.filter === 'all'
          ? MOCK_RECOMMENDATIONS
          : MOCK_RECOMMENDATIONS.filter((r) => r.type === params.filter);

      return items;
    },
  });

  isLoading = computed(() => this.recommendations.isLoading());
  error = computed(() => this.recommendations.error());
  data = computed(() => this.recommendations.value() ?? []);
  count = computed(() => this.data().length);

  setFilter(filter: RecommendationFilter) {
    this.filter.set(filter);
  }
}
