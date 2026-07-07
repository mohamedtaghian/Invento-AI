import { ChangeDetectionStrategy, Component, inject, input, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnNavigationMenuTrigger } from '@spartan-ng/brain/navigation-menu';
import { classes } from '@spartan/helm/utils';
import { navMenuTriggerClasses } from '@spartan/styles';
import type { HlmStyle } from '@spartan/styles';
import { injectResolvedHlmStyle } from '@spartan/styles';
import { HlmNavigationMenu } from './hlm-navigation-menu';

@Component({
  selector: 'button[hlmNavigationMenuTrigger]',
  imports: [NgIcon],
  providers: [provideIcons({ lucideChevronDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: BrnNavigationMenuTrigger, inputs: ['align'] }],
  host: { 'data-slot': 'navigation-menu-trigger' },
  template: `
    <ng-content />
    <ng-icon
      name="lucideChevronDown"
      class="relative top-px ml-1 size-3 transition duration-300 group-data-open/navigation-menu-trigger:rotate-180"
    />
  `,
})
export class HlmNavigationMenuTrigger {
  private readonly _parent = inject(HlmNavigationMenu, { optional: true });
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(
    computed(() => this.hlmStyle() ?? this._parent?.hlmStyle()),
  );

  constructor() {
    classes(() => navMenuTriggerClasses[this._resolvedStyle()]);
  }
}
