import { Directive, inject, input, computed } from '@angular/core';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle } from '@spartan/styles';
import { HlmCard } from './hlm-card';

@Directive({
  selector: '[hlmCardDescription]',
  host: { 'data-slot': 'card-description' },
})
export class HlmCardDescription {
  private readonly _parentCard = inject(HlmCard, { optional: true });
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(
    computed(() => this.hlmStyle() ?? this._parentCard?.hlmStyle()),
  );

  constructor() {
    classes(() => 'text-muted-foreground text-sm');
  }
}
