import { Injectable, computed, inject, signal, type Signal, type WritableSignal } from '@angular/core';
import type { Locale } from './locale';
import { TRANSLATION_LOADER, type TranslationLoader } from './translation-loader';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly _locale: WritableSignal<Locale> = signal<Locale>('en');
  private readonly _translations: WritableSignal<Record<string, string>> = signal({});
  private readonly _loader: TranslationLoader | null = inject(TRANSLATION_LOADER, { optional: true });

  readonly locale: Signal<Locale> = this._locale.asReadonly();
  readonly isRtl: Signal<boolean> = computed(() => this._locale() === 'ar');
  readonly translations: Signal<Record<string, string>> = this._translations.asReadonly();

  constructor() {
    this.switchLocale('en');
  }

  switchLocale(locale: Locale): void {
    this._locale.set(locale);
    this._translations.set(this._loader?.(locale) ?? {});
  }

  translate(key: string): string {
    return this._translations()[key] ?? key;
  }

  localePath(segments: string[]): string[] {
    return ['/', this._locale(), ...segments];
  }
}
