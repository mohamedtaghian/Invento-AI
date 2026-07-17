import { Routes } from '@angular/router';
import { Products } from '@invento/user-site/app/features/product/products';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: Products },
  { path: '**', redirectTo: 'products' },
];
