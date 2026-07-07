import { Directive, inject, input, computed } from '@angular/core';
import { BrnNavigationMenuList } from '@spartan-ng/brain/navigation-menu';
import { classes } from '@spartan/helm/utils';
import { navMenuListClasses } from '@spartan/styles';
import type { HlmStyle } from '@spartan/styles';
import { injectResolvedHlmStyle } from '@spartan/styles';
import { HlmNavigationMenu } from './hlm-navigation-menu';

@Directive({
  selector: 'ul[hlmNavigationMenuList]',
  hostDirectives: [
    {
      directive: BrnNavigationMenuList,
    },
  ],
  host: {
    'data-slot': 'navigation-menu-list',
  },
})
export class HlmNavigationMenuList {
  private readonly _parent = inject(HlmNavigationMenu, { optional: true });
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(
    computed(() => this.hlmStyle() ?? this._parent?.hlmStyle()),
  );

  constructor() {
    classes(() => navMenuListClasses[this._resolvedStyle()]);
  }
}
