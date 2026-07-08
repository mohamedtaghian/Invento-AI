import { Directive, input } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle, dialogFooterClasses } from '@spartan/styles';

@Directive({
  selector: '[hlmDialogFooter],hlm-dialog-footer',
  host: { 'data-slot': 'dialog-footer' },
})
export class HlmDialogFooter {
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => dialogFooterClasses[this._resolvedStyle()]);
  }
}
