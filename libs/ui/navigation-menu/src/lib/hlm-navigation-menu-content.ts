import { type NumberInput } from '@angular/cdk/coercion';
import { Directive, inject, input, numberAttribute, computed } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { navMenuContentClasses } from '@spartan/styles';
import type { HlmStyle } from '@spartan/styles';
import { injectResolvedHlmStyle } from '@spartan/styles';
import { HlmNavigationMenu } from './hlm-navigation-menu';

@Directive({
  selector: '[hlmNavigationMenuContent],hlm-navigation-menu-content',
  host: {
    'data-slot': 'navigation-menu-content',
    '[style.--nav-offset]': 'navOffset()',
  },
})
export class HlmNavigationMenuContent {
  private readonly _parent = inject(HlmNavigationMenu, { optional: true });
  public readonly navOffset = input<number, NumberInput>(1.5, { transform: numberAttribute });
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(
    computed(() => this.hlmStyle() ?? this._parent?.hlmStyle()),
  );

  constructor() {
    classes(() => navMenuContentClasses[this._resolvedStyle()]);
  }
}
