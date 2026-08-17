import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductStore } from '@invento/user-site/app/features/product';
import { HlmBreadcrumbImports } from '@spartan/helm/breadcrumb';
import { hlmUl } from '@spartan/helm/typography';
import { environment } from '../../../../../environments/environment';
import { RouterModule } from '@angular/router';

import { TranslatePipe } from '@invento/core';

@Component({
  selector: 'app-breadcrumb-trail',
  templateUrl: './breadcrumb-trail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmBreadcrumbImports, RouterModule, TranslatePipe],
})
export class BreadcrumbTrail {
  protected readonly hlmUl = hlmUl;
  protected readonly store = inject(ProductStore);
  protected readonly storeSlug = environment.storeSlug;
}
