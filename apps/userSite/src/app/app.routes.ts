import { Route } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout';
import { NotFoundComponent } from './components/not-found/not-found';
import { OrderConfirmedComponent } from './components/order-confirmed/order-confirmed';

export const appRoutes: Route[] = [
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmed', component: OrderConfirmedComponent },

  // The wild component (404) MUST go at the very bottom
  { path: '**', component: NotFoundComponent },
];
