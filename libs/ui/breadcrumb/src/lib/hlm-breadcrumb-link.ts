import { Directive, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, breadcrumbLinkClassesByStyle, injectResolvedHlmStyle } from '@spartan/styles';

@Directive({
  selector: '[hlmBreadcrumbLink]',
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: [
        'target',
        'queryParams',
        'fragment',
        'queryParamsHandling',
        'state',
        'info',
        'relativeTo',
        'preserveFragment',
        'skipLocationChange',
        'replaceUrl',
        'routerLink: link',
      ],
    },
  ],
  host: {
    'data-slot': 'breadcrumb-link',
  },
})
export class HlmBreadcrumbLink {
  public readonly link = input<RouterLink['routerLink']>();
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => breadcrumbLinkClassesByStyle[this._resolvedStyle()]);
  }
}
