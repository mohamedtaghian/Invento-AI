import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductStore } from '../../data/product-store';

@Component({
  selector: 'app-breadcrumb-trail',
  templateUrl: './breadcrumb-trail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class BreadcrumbTrail {
  protected readonly store = inject(ProductStore);
}
