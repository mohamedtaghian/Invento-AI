import { computed, Directive, effect, input, untracked } from '@angular/core';
import { injectCustomClassSettable } from '@spartan-ng/brain/core';
import { BrnDialogOverlay } from '@spartan-ng/brain/dialog';
import { hlm } from '@spartan/helm/utils';
import { type HlmStyle, injectResolvedHlmStyle, dialogOverlayClasses } from '@spartan/styles';
import type { ClassValue } from 'clsx';

export const hlmDialogOverlayClass = dialogOverlayClasses['vega'];

@Directive({
  selector: '[hlmDialogOverlay],hlm-dialog-overlay',
  hostDirectives: [BrnDialogOverlay],
})
export class HlmDialogOverlay {
  private readonly _classSettable = injectCustomClassSettable({ optional: true, host: true });

  public readonly hlmStyle = input<HlmStyle>();
  private readonly _resolvedStyle = injectResolvedHlmStyle(this.hlmStyle);
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(dialogOverlayClasses[this._resolvedStyle()], this.userClass()),
  );

  constructor() {
    effect(() => {
      const newClass = this._computedClass();
      untracked(() => this._classSettable?.setClassToCustomElement(newClass));
    });
  }
}
