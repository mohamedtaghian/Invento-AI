import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductStore } from '../../data/product-store';

@Component({
  selector: 'app-variant-selector',
  templateUrl: './variant-selector.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariantSelector {
  protected readonly store = inject(ProductStore);
}
