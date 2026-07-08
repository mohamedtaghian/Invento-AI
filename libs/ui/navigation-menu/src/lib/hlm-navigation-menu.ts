import { Directive, input } from '@angular/core';
import { BrnNavigationMenu } from '@spartan-ng/brain/navigation-menu';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle, navMenuClasses } from '@spartan/styles';

@Directive({
  selector: 'nav[hlmNavigationMenu]',
  hostDirectives: [
    {
      directive: BrnNavigationMenu,
      inputs: ['value', 'delayDuration', 'skipDelayDuration', 'orientation', 'openOn'],
      outputs: ['valueChange'],
    },
  ],
  host: {
    'data-slot': 'navigation-menu',
  },
})
export class HlmNavigationMenu {
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => navMenuClasses[this._resolvedStyle()]);
  }
}
