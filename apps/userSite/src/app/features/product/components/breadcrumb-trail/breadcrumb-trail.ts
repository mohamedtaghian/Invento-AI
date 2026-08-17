import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductStore } from '@invento/user-site/app/features/product/service/product-store';
import { HlmBreadcrumbImports } from '@spartan/helm/breadcrumb';
import { hlmUl } from '@spartan/helm/typography';

@Component({
  selector: 'app-breadcrumb-trail',
  templateUrl: './breadcrumb-trail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmBreadcrumbImports],
})
export class BreadcrumbTrail {
  protected readonly hlmUl = hlmUl;
  protected readonly store = inject(ProductStore);
}
