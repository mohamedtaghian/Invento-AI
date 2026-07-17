import { Injectable, PLATFORM_ID, computed, effect, inject, signal, type Signal, type WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { Locale } from './locale';
import { TRANSLATION_LOADER, type TranslationLoader } from './translation-loader';

const LOCALE_STORAGE_KEY = 'invento_locale';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly _locale: WritableSignal<Locale> = signal<Locale>('en');
  private readonly _translations: WritableSignal<Record<string, string>> = signal({});
  private readonly _loader: TranslationLoader | null = inject(TRANSLATION_LOADER, { optional: true });
  private readonly _platformId = inject(PLATFORM_ID);

  readonly locale: Signal<Locale> = this._locale.asReadonly();
  readonly isRtl: Signal<boolean> = computed(() => this._locale() === 'ar');
  readonly translations: Signal<Record<string, string>> = this._translations.asReadonly();

  constructor() {
    const saved = isPlatformBrowser(this._platformId)
      ? localStorage.getItem(LOCALE_STORAGE_KEY)
      : null;
    const valid: Locale = saved === 'en' || saved === 'ar' ? saved : 'en';
    this.switchLocale(valid);

    effect(() => {
      const current = this._locale();
      const rtl = this.isRtl();
      if (isPlatformBrowser(this._platformId)) {
        document.documentElement.lang = current;
        document.documentElement.dir = rtl ? 'rtl' : 'ltr';
        localStorage.setItem(LOCALE_STORAGE_KEY, current);
      }
    });
  }

  switchLocale(locale: Locale): void {
    this._locale.set(locale);
    this._translations.set(this._loader?.(locale) ?? {});
  }

  translate(key: string, params?: Record<string, string | number>): string {
    let value = this._translations()[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
      }
    }
    return value;
  }

  localePath(segments: string[]): string[] {
    return ['/', this._locale(), ...segments];
  }
}



// Mo'men Comment:
// This file is -> the core state manager -> Injected to root as one singleton instance for the whole app
// The underscore prefix here is a convention indicating it as a private  
// asReadonly() -> returns a Signal (not WritableSignal) 
// 
// Private Singals -> _locale: WritableSignal<Locale>, _translations: WritableSignal<Record<string, string>>
// _locale -> signal<Locale>('en') -> creates a reactive, mutable container initialized to 'en'.
// WritableSignals here means we can call both .set(), .update() on them.
// 
// Injected dependencies -> _loader: TranslationLoader | null, _platformId
// _loader -> injected as optional -> to avoid throw an error if no body provided it -> so we procide the type with null too.
// _platformId -> a built-in Angular token to know whether the code is currently running in the browser or on the server
  //  it is important the browser-only APIs used later (localStorage, document) don't exist on the server and would throw a ReferenceError if called there.
// 
// Public read-only API -> locale: Signal<Locale>, isRtl: Signal<boolean>, translations: Signal<Record<string, string>>
//  locale -> by asReadonly -> to let ouside read it but avoid set on it by .set() -> 
//  to enforce the "single source of truth, controlled mutation" pattern
//  isRtl -> a lazy and memoized -> if nothing reads it, it doesn't recompute even if _locale changes.
// 
// Constructor — initialization + side effects
// isPlatformBrowser(this._platformId) -> the safe way to check if we are in server or client 
//  -> it is run in constructor as it is run in both server and browser -> so to check if we in server gives null else get from localstorage lang value (en OR ar)
//  -> and save the value of true (in client) or null (in server) -> saved ?? 'en' 
//  ->  if saved is null or undefined (not found, or server-side), fall back to 'en' as the default locale by this.switchLocale().
// effect() -> a reactive side-effect that automatically re-runs whenever any signal it reads changes -> effects normally run after change detection, asynchronously
//  -> uses automatic dependency tracking: it doesn't need you to declare [this._locale, this.isRtl] as dependencies. 
//  -> It watches which signals get called (read) during its execution and re-subscribes to exactly those.
//  -> Because it's declared inside the constructor of an injectable, Angular automatically ties its lifecycle to the service and cleans it up appropriately.
//  Every time the locale changes, this effect:
//    -> Sets the lang attribute on the root <html> element -> through -> document.documentElement.lang = current
//    -> Sets the dir attribute to 'rtl' or 'ltr' -> this is what actually flips the entire page's layout direction in the browser.
//    -> Persists the chosen locale to localStorage so it survives a page reload.
//  And isPlatformBrowser is a guard again prevents crashes during SSR, where document doesn't exist.
// 
// switchLocale(locale: Locale): void -> mutation method ->he only method that changes the current locale -> with two things happen atomically
//    -> this._locale.set(locale) -> Update the _locale signal to the new value.
//        -> Calling _locale.set() triggers the effect() -> to re-run, and also triggers isRtl to recompute lazily, and causes any component reading locale() to re-render. 
//    -> this._translations.set(this._loader?.(locale) ?? {}) -> Re-fetch translations by calling the loader function with the new locale
//    -> 
// 
// translate(key: string, params?: Record<string, string | number>): string
//    -> this._translations()[key] -> reads the current translations dictionary and looks up key
//    -> calling translate() directly inside a template -> as -> {{ localeService.translate('foo') }}
//        -> would not automatically re-render when the locale changes, because Angular's template binding doesn't know this function call depends on a signal 
//            -> unless something else in the same render forces re-evaluation -> where TranslatePipe occurs
//    -> if the key isn't found in the translation dictionary, return the raw key itself (e.g. 'home.title') rather than undefined or an empty string.
//        -> This is a common, deliberate i18n pattern — it makes missing translations visible in the UI during development rather than silently blank.
// 
// localePath(segments: string[]): string[]
//    -> Given path segments like ['products', '42'], and current locale 'en' -> producing a URL like /en/products/42
// .
