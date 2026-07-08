import { Directive, inject, input, computed } from '@angular/core';
import { BrnNavigationMenuLink } from '@spartan-ng/brain/navigation-menu';
import { classes } from '@spartan/helm/utils';
import { navMenuLinkClasses } from '@spartan/styles';
import type { HlmStyle } from '@spartan/styles';
import { injectResolvedHlmStyle } from '@spartan/styles';
import { HlmNavigationMenu } from './hlm-navigation-menu';

@Directive({
  selector: 'a[hlmNavigationMenuLink]',
  hostDirectives: [{ directive: BrnNavigationMenuLink, inputs: ['active'] }],
  host: {
    'data-slot': 'navigation-menu-link',
  },
})
export class HlmNavigationMenuLink {
  private readonly _parent = inject(HlmNavigationMenu, { optional: true });
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(
    computed(() => this.hlmStyle() ?? this._parent?.hlmStyle()),
  );

  constructor() {
    classes(() => navMenuLinkClasses[this._resolvedStyle()]);
  }
}
