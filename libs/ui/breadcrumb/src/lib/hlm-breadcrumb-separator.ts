import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { classes } from '@spartan/helm/utils';
import { type HlmStyle, breadcrumbSeparatorClassesByStyle, injectResolvedHlmStyle } from '@spartan/styles';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[hlmBreadcrumbSeparator]',
  imports: [NgIcon],
  providers: [provideIcons({ lucideChevronRight })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'breadcrumb-separator',
    role: 'presentation',
    'aria-hidden': 'true',
  },
  template: `
    <ng-content>
      <ng-icon name="lucideChevronRight" />
    </ng-content>
  `,
})
export class HlmBreadcrumbSeparator {
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  constructor() {
    classes(() => breadcrumbSeparatorClassesByStyle[this._resolvedStyle()]);
  }
}
