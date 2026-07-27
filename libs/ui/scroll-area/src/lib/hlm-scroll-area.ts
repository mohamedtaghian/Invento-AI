import { Directive, input } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { provideScrollbarOptions } from 'ngx-scrollbar';
import { type HlmStyle, injectResolvedHlmStyle, scrollAreaClassesByStyle } from '@spartan/styles';

@Directive({
  selector: 'ng-scrollbar[hlm],ng-scrollbar[hlmScrollbar]',
  providers: [provideScrollbarOptions({ visibility: 'hover' })],
  host: {
    'data-slot': 'scroll-area',
    '[style.--scrollbar-thumb-color]': '"var(--border)"',
    '[style.--scrollbar-thumb-hover-color]': '"var(--border)"',
    '[style.--scrollbar-track-color]': '"transparent"',
    '[style.--scrollbar-track-thickness]': '"0.625rem"',
    '[style.--scrollbar-track-offset]': '"1.5px"',
  },
})
export class HlmScrollArea {
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => scrollAreaClassesByStyle[this._resolvedStyle()]);
  }
}
