import { Routes } from '@angular/router';
import { Products } from '@invento/user-site/app/features/product/components/product/product';
import { ProductDetails } from '@invento/user-site/app/features/product/components/product-details/product-details';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: Products },
  { path: 'product-details/:id', component: ProductDetails },
  { path: '**', redirectTo: 'products' },
];
