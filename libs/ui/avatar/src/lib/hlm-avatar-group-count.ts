import { Directive, input } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle, avatarGroupCountClasses } from '@spartan/styles';

@Directive({
  selector: '[hlmAvatarGroupCount],hlm-avatar-group-count',
  host: {
    'data-slot': 'avatar-group-count',
  },
})
export class HlmAvatarGroupCount {
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => avatarGroupCountClasses[this._resolvedStyle()]);
  }
}
