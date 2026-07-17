import { Directive, input } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, breadcrumbClasses, injectResolvedHlmStyle } from '@spartan/styles';

@Directive({
  selector: '[hlmBreadcrumb]',
  host: {
    'data-slot': 'breadcrumb',
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class HlmBreadcrumb {
  public readonly ariaLabel = input<string>('breadcrumb', { alias: 'aria-label' });
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => breadcrumbClasses[this._resolvedStyle()]);
  }
}
