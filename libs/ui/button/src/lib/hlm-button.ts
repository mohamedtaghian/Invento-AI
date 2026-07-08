import { Directive, input, signal } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { classes } from '@spartan/helm/utils';
import type { ClassValue } from 'clsx';
import { injectBrnButtonConfig } from './hlm-button.token';
import { buttonVariantsByStyle, type HlmStyle } from '@spartan/styles';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type ButtonSize =
  | 'default'
  | 'xs'
  | 'sm'
  | 'lg'
  | 'icon'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-lg';
export type ButtonVariants = { variant: ButtonVariant; size: ButtonSize };

@Directive({
  selector: 'button[hlmBtn], a[hlmBtn]',
  exportAs: 'hlmBtn',
  hostDirectives: [{ directive: BrnButton, inputs: ['disabled'] }],
  host: { 'data-slot': 'button' },
})
export class HlmButton {
  private readonly _config = injectBrnButtonConfig();
  private readonly _additionalClasses = signal<ClassValue>('');

  public readonly variant = input<ButtonVariant>(this._config.variant);
  public readonly size = input<ButtonSize>(this._config.size);
  public readonly hlmStyle = input<HlmStyle>('vega');

  constructor() {
    classes(() => [
      buttonVariantsByStyle[this.hlmStyle()]({ variant: this.variant(), size: this.size() }),
      this._additionalClasses(),
    ]);
  }

  setClass(classes: string): void {
    this._additionalClasses.set(classes);
  }
}
