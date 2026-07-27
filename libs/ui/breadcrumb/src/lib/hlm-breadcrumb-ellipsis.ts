import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { hlm } from '@spartan/helm/utils';
import { type HlmStyle, breadcrumbEllipsisClassesByStyle, injectResolvedHlmStyle } from '@spartan/styles';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-breadcrumb-ellipsis',
  imports: [NgIcon],
  providers: [provideIcons({ lucideEllipsis })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="sr-only"
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      [class]="_computedClass()"
    >
      <ng-icon name="lucideEllipsis" />
      <span class="sr-only">{{ srOnlyText() }}</span>
    </span>
  `,
})
export class HlmBreadcrumbEllipsis {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  public readonly srOnlyText = input<string>('More');
  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);

  protected readonly _computedClass = computed(() =>
    hlm(breadcrumbEllipsisClassesByStyle[this._resolvedStyle()], this.userClass()),
  );
}
