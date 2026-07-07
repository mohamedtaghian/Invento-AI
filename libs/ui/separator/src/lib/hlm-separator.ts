import { Directive, input } from '@angular/core';
import { BrnSeparator } from '@spartan-ng/brain/separator';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle, separatorClassesByStyle } from '@spartan/styles';

export const hlmSeparatorClass =
  'inline-flex shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch';

@Directive({
  selector: '[hlmSeparator],hlm-separator',
  hostDirectives: [{ directive: BrnSeparator, inputs: ['orientation', 'decorative'] }],
  host: {
    'data-slot': 'separator',
  },
})
export class HlmSeparator {
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => separatorClassesByStyle[this._resolvedStyle()]);
  }
}
