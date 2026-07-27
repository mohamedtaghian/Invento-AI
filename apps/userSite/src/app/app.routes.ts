import { Routes } from '@angular/router';
import { Products } from '@invento/user-site/app/features/product/products';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: Products },
  { path: '**', redirectTo: 'products' },
];
