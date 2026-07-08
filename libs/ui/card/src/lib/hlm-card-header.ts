import { Directive, inject, input, computed } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle } from '@spartan/styles';
import { HlmCard } from './hlm-card';

@Directive({
  selector: '[hlmCardHeader],hlm-card-header',
  host: { 'data-slot': 'card-header' },
})
export class HlmCardHeader {
  private readonly _parentCard = inject(HlmCard, { optional: true });
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(
    computed(() => this.hlmStyle() ?? this._parentCard?.hlmStyle()),
  );

  constructor() {
    classes(
      () =>
        'gap-1 rounded-t-xl px-(--card-spacing) [.border-b]:pb-(--card-spacing) group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]',
    );
  }
}
