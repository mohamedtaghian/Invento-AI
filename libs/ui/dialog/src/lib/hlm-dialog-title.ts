import { Directive, input } from '@angular/core';
import { BrnDialogTitle } from '@spartan-ng/brain/dialog';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle, dialogTitleClasses } from '@spartan/styles';

@Directive({
  selector: '[hlmDialogTitle]',
  hostDirectives: [BrnDialogTitle],
  host: { 'data-slot': 'dialog-title' },
})
export class HlmDialogTitle {
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => dialogTitleClasses[this._resolvedStyle()]);
  }
}
