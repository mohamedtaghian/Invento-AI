import { Directive, input } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle, badgeVariantsByStyle } from '@spartan/styles';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';

@Directive({
  selector: '[hlmBadge],hlm-badge',
  host: {
    'data-slot': 'badge',
    '[attr.data-variant]': 'variant()',
  },
})
export class HlmBadge {
  public readonly variant = input<BadgeVariant>('default');
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => badgeVariantsByStyle[this._resolvedStyle()]({ variant: this.variant() }));
  }
}
