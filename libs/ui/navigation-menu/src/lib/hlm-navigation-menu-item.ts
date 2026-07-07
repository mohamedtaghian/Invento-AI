import { Directive, inject, input, computed } from '@angular/core';
import { BrnNavigationMenuItem } from '@spartan-ng/brain/navigation-menu';
import { classes } from '@spartan/helm/utils';
import { navMenuItemClasses } from '@spartan/styles';
import type { HlmStyle } from '@spartan/styles';
import { injectResolvedHlmStyle } from '@spartan/styles';
import { HlmNavigationMenu } from './hlm-navigation-menu';

@Directive({
  selector: 'li[hlmNavigationMenuItem]',
  hostDirectives: [{ directive: BrnNavigationMenuItem, inputs: ['id'] }],
  host: {
    'data-slot': 'navigation-menu-item',
  },
})
export class HlmNavigationMenuItem {
  private readonly _parent = inject(HlmNavigationMenu, { optional: true });
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(
    computed(() => this.hlmStyle() ?? this._parent?.hlmStyle()),
  );

  constructor() {
    classes(() => navMenuItemClasses[this._resolvedStyle()]);
  }
}
