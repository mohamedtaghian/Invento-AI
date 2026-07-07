import { Directive, inject, input, computed } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle } from '@spartan/styles';
import { HlmCard } from './hlm-card';

@Directive({
  selector: '[hlmCardFooter],hlm-card-footer',
  host: { 'data-slot': 'card-footer' },
})
export class HlmCardFooter {
  private readonly _parentCard = inject(HlmCard, { optional: true });
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(
    computed(() => this.hlmStyle() ?? this._parentCard?.hlmStyle()),
  );

  constructor() {
    classes(
      () => 'rounded-b-xl px-(--card-spacing) [.border-t]:pt-(--card-spacing) flex items-center',
    );
  }
}
