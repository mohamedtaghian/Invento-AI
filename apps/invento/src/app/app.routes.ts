import { Routes } from '@angular/router';
import { MainLayout } from '@invento/invento/layouts/main-layout/main-layout';

export const appRoutes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('@invento/invento/pages/home/home').then((c) => c.Home),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('@invento/invento/pages/products/products').then((c) => c.Products),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('@invento/invento/pages/users/users').then((c) => c.Users),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('@invento/invento/pages/orders/orders').then((c) => c.Orders),
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('@invento/invento/pages/suppliers/suppliers').then((c) => c.Suppliers),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('@invento/invento/pages/analytics/analytics').then((c) => c.Analytics),
      },
      {
        path: 'ai-advisor',
        loadComponent: () =>
          import('@invento/invento/pages/ai-advisor/ai-advisor').then((c) => c.AiAdvisor),
      },
    ],
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('@invento/invento/pages/not-found/not-found').then((c) => c.NotFound),
  },
  { path: '**', redirectTo: 'not-found' },
];
