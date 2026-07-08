import { Directive, input } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle, avatarGroupClasses } from '@spartan/styles';

@Directive({
  selector: '[hlmAvatarGroup],hlm-avatar-group',
  host: {
    'data-slot': 'avatar-group',
  },
})
export class HlmAvatarGroup {
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => avatarGroupClasses[this._resolvedStyle()]);
  }
}
