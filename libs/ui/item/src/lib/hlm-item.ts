import { Directive, input } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle, itemVariantsByStyle } from '@spartan/styles';
import { injectHlmItemConfig } from './hlm-item-token';

@Directive({
  selector: '[hlmItem],hlm-item',
  host: {
    'data-slot': 'item',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
  },
})
export class HlmItem {
  private readonly _config = injectHlmItemConfig();
  public readonly variant = input<string>(this._config.variant);
  public readonly size = input<string>(this._config.size);
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() =>
      itemVariantsByStyle[this._resolvedStyle()]({ variant: this.variant(), size: this.size() }),
    );
  }
}
