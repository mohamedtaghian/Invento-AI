import { Routes } from '@angular/router';

import { Products } from '@invento/user-site/app/features/product/components/product/product';
import { ProductDetails } from '@invento/user-site/app/features/product/components/product-details/product-details';
import { CheckoutComponent } from '@invento/user-site/app/features/checkout/checkout';
import { NotFoundComponent } from '@invento/user-site/app/shared/components/not-found/not-found';
import { OrderConfirmedComponent } from '@invento/user-site/app/features/order-confirmed/order-confirmed';
import { HomeComponent } from '@invento/user-site/app/features/home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'products', component: Products },
  { path: 'product-details/:id', component: ProductDetails },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmed', component: OrderConfirmedComponent },

  // The wild component (404) MUST go at the very bottom
  { path: '**', component: NotFoundComponent },
];
