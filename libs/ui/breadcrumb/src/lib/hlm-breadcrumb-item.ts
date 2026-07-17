import { Directive, input } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, breadcrumbItemClassesByStyle, injectResolvedHlmStyle } from '@spartan/styles';

@Directive({
  selector: '[hlmBreadcrumbItem]',
  host: {
    'data-slot': 'breadcrumb-item',
  },
})
export class HlmBreadcrumbItem {
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => breadcrumbItemClassesByStyle[this._resolvedStyle()]);
  }
}
