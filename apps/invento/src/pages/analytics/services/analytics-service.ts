// analytics.service.ts
import { Injectable, computed, resource, signal } from '@angular/core';
// import { httpResource } from '@angular/common/http';

export interface AnalyticsResponse {
  revenue: { total: number; change: number; trend: number[] };
  orders: { total: number; change: number; trend: number[] };
  avgOrderValue: { total: number; change: number; trend: number[] };
  conversionRate: { total: number; change: number; trend: number[] };
  revenueSeries: { labels: string[]; current: number[]; previous: number[] };
  ordersByStatus: { label: string; value: number; color: string }[];
}

export type AnalyticsRange = '7d' | '30d' | '90d';

const MOCK_DATA: Record<AnalyticsRange, AnalyticsResponse> = {
  '30d': {
    revenue: { total: 21049, change: 22.7, trend: [8, 6, 9, 11, 8, 12, 15, 13, 17, 15, 19, 21] },
    orders: { total: 79, change: 18.3, trend: [3, 4, 3, 5, 6, 5, 7, 6, 8, 7, 9, 8] },
    avgOrderValue: {
      total: 266.44,
      change: 3.7,
      trend: [220, 230, 225, 240, 235, 250, 245, 260, 255, 265, 260, 266],
    },
    conversionRate: {
      total: 3.1,
      change: 0.8,
      trend: [2.1, 2.3, 2.2, 2.5, 2.6, 2.4, 2.8, 2.7, 2.9, 3.0, 2.9, 3.1],
    },
    revenueSeries: {
      labels: [
        'May 21',
        'May 24',
        'May 27',
        'May 30',
        'Jun 2',
        'Jun 5',
        'Jun 8',
        'Jun 11',
        'Jun 14',
        'Jun 17',
        'Jun 20',
      ],
      current: [280, 220, 350, 400, 330, 420, 480, 460, 560, 610, 590, 650, 700, 680, 780, 820],
      previous: [260, 240, 300, 340, 310, 360, 400, 390, 440, 470, 460, 490, 520, 500, 560, 590],
    },
    ordersByStatus: [
      { label: 'Delivered', value: 48, color: '#10b981' },
      { label: 'Shipped', value: 14, color: '#3b82f6' },
      { label: 'Processing', value: 9, color: '#f59e0b' },
      { label: 'Placed', value: 5, color: '#8b5cf6' },
      { label: 'Cancelled', value: 3, color: '#ef4444' },
    ],
  },
  '7d': {
    revenue: { total: 5210, change: 12.4, trend: [4, 5, 4, 6, 7, 6, 8] },
    orders: { total: 22, change: 9.1, trend: [2, 3, 2, 4, 3, 4, 4] },
    avgOrderValue: { total: 236.8, change: -1.2, trend: [240, 235, 245, 238, 232, 236, 236] },
    conversionRate: { total: 2.8, change: 0.3, trend: [2.6, 2.7, 2.6, 2.8, 2.9, 2.7, 2.8] },
    revenueSeries: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      current: [600, 720, 680, 810, 900, 860, 950],
      previous: [560, 640, 600, 700, 780, 740, 800],
    },
    ordersByStatus: [
      { label: 'Delivered', value: 12, color: '#10b981' },
      { label: 'Shipped', value: 5, color: '#3b82f6' },
      { label: 'Processing', value: 3, color: '#f59e0b' },
      { label: 'Placed', value: 1, color: '#8b5cf6' },
      { label: 'Cancelled', value: 1, color: '#ef4444' },
    ],
  },
  '90d': {
    revenue: {
      total: 58210,
      change: 31.2,
      trend: [30, 34, 32, 38, 40, 42, 45, 48, 50, 53, 55, 58],
    },
    orders: { total: 231, change: 24.6, trend: [15, 17, 16, 19, 20, 22, 21, 23, 24, 25, 26, 27] },
    avgOrderValue: {
      total: 252.1,
      change: 5.4,
      trend: [230, 235, 232, 240, 244, 248, 246, 250, 249, 251, 250, 252],
    },
    conversionRate: {
      total: 3.4,
      change: 1.1,
      trend: [2.4, 2.6, 2.7, 2.9, 3.0, 3.1, 3.0, 3.2, 3.3, 3.2, 3.3, 3.4],
    },
    revenueSeries: {
      labels: [
        'Wk 1',
        'Wk 2',
        'Wk 3',
        'Wk 4',
        'Wk 5',
        'Wk 6',
        'Wk 7',
        'Wk 8',
        'Wk 9',
        'Wk 10',
        'Wk 11',
        'Wk 12',
      ],
      current: [3800, 4100, 3950, 4300, 4500, 4700, 4600, 4900, 5100, 5300, 5200, 5450],
      previous: [3400, 3700, 3600, 3900, 4000, 4200, 4150, 4400, 4550, 4700, 4650, 4800],
    },
    ordersByStatus: [
      { label: 'Delivered', value: 140, color: '#10b981' },
      { label: 'Shipped', value: 42, color: '#3b82f6' },
      { label: 'Processing', value: 28, color: '#f59e0b' },
      { label: 'Placed', value: 14, color: '#8b5cf6' },
      { label: 'Cancelled', value: 7, color: '#ef4444' },
    ],
  },
};

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  // signal input drives the resource params — changing `range()` refetches automatically
  range = signal<AnalyticsRange>('30d'); // see note below if you don't have this helper

  //   analytics = httpResource<AnalyticsResponse>(() => ({
  //     url: '/api/analytics',
  //     params: { range: this.range() },
  //   }));

  analytics = resource<AnalyticsResponse, { range: AnalyticsRange }>({
    params: () => ({ range: this.range() }),
    loader: async ({ params }) => {
      // simulate network latency so your loading skeletons are visible/testable
      await new Promise((r) => setTimeout(r, 400));
      return MOCK_DATA[params.range];
    },
  });

  isLoading = computed(() => this.analytics.isLoading());
  error = computed(() => this.analytics.error());
  data = computed<AnalyticsResponse | undefined>(() => this.analytics.value());
}
