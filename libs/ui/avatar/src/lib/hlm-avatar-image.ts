import { Directive, inject, input } from '@angular/core';
import { BrnAvatarImage } from '@spartan-ng/brain/avatar';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle, avatarImageClasses } from '@spartan/styles';

@Directive({
  selector: 'img[hlmAvatarImage]',
  exportAs: 'hlmAvatarImage',
  hostDirectives: [BrnAvatarImage],
  host: {
    'data-slot': 'avatar-image',
  },
})
export class HlmAvatarImage {
  public readonly canShow = inject(BrnAvatarImage).canShow;
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => avatarImageClasses[this._resolvedStyle()]);
  }
}
