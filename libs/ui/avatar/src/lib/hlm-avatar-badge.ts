import { Directive, input } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle, avatarBadgeClasses } from '@spartan/styles';

@Directive({
  selector: '[hlmAvatarBadge],hlm-avatar-badge',
  host: {
    'data-slot': 'avatar-badge',
  },
})
export class HlmAvatarBadge {
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => avatarBadgeClasses[this._resolvedStyle()]);
  }
}
