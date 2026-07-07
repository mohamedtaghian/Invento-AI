import { Directive, input } from '@angular/core';
import { BrnDialogDescription } from '@spartan-ng/brain/dialog';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle, dialogDescriptionClasses } from '@spartan/styles';

@Directive({
  selector: '[hlmDialogDescription]',
  hostDirectives: [BrnDialogDescription],
  host: { 'data-slot': 'dialog-description' },
})
export class HlmDialogDescription {
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => dialogDescriptionClasses[this._resolvedStyle()]);
  }
}
