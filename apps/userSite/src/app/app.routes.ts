import { Routes } from '@angular/router';

import { Products } from '@invento/user-site/app/features/product/components/product/product';
import { ProductDetails } from '@invento/user-site/app/features/product/components/product-details/product-details';
import { CheckoutComponent } from '@invento/user-site/app/features/product/components/checkout/checkout';
import { NotFoundComponent } from '@invento/user-site/app/features/product/components/not-found/not-found';
import { OrderConfirmedComponent } from '@invento/user-site/app/features/product/components/order-confirmed/order-confirmed';
import { HomeComponent } from '@invento/user-site/app/features/product/components/home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: Products },
  { path: '**', redirectTo: 'products' },
  { path: 'products', component: Products },
  { path: 'product-details/:id', component: ProductDetails },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmed', component: OrderConfirmedComponent },

  // The wild component (404) MUST go at the very bottom
  { path: '**', component: NotFoundComponent },
];
