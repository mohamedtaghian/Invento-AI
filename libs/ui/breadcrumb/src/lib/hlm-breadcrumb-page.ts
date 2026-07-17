import { Directive, input } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, breadcrumbPageClassesByStyle, injectResolvedHlmStyle } from '@spartan/styles';

@Directive({
  selector: '[hlmBreadcrumbPage]',
  host: {
    'data-slot': 'breadcrumb-page',
    role: 'link',
    'aria-disabled': 'true',
    'aria-current': 'page',
  },
})
export class HlmBreadcrumbPage {
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => breadcrumbPageClassesByStyle[this._resolvedStyle()]);
  }
}
