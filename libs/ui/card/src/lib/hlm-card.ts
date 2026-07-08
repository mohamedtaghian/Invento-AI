import { Directive, input } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle, cardClassesByStyle } from '@spartan/styles';
import { HlmCardConfig, injectHlmCardConfig } from './hlm-card.token';

@Directive({
  selector: '[hlmCard],hlm-card',
  host: {
    'data-slot': 'card',
    '[attr.data-size]': 'size()',
  },
})
export class HlmCard {
  private readonly _defaultConfig = injectHlmCardConfig();
  public readonly size = input<HlmCardConfig['size']>(this._defaultConfig.size);
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => cardClassesByStyle[this._resolvedStyle()]);
  }
}
