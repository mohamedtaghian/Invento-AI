export { type Locale } from './locale';
export { LocaleService } from './locale-service';
export { TranslatePipe } from './translate-pipe';
export { LocaleRoutePipe } from './locale-route-pipe';
export { TRANSLATION_LOADER, type TranslationLoader } from './translation-loader';



// Mo'men Comment: The full flow :
//     1- On app startup, LocaleService is instantiated (singleton), reads any saved locale from localStorage (browser only),
//        and calls switchLocale() to load the matching translation dictionary via the injected TRANSLATION_LOADER function.
// 
//     2- The constructor's effect() keeps the <html lang> and <html dir> attributes and localStorage in sync automatically, 
//        forever, with zero manual wiring elsewhere in the app.
// 
//     3- Components/templates use -> 
//          -> {{ 'some.key' | translate }} to render translated text reactively.
//          -> [routerLink]="['path'] | localeRoute" to build locale-prefixed URLs reactively.
//          -> localeService.isRtl() to conditionally apply RTL-specific styling/logic.
//          -> localeService.switchLocale('ar') (e.g. from a language switcher button) to change the whole app's language, direction, and persisted preference in one call.
// 
// Everything is signal-driven, so there's no manual subscription/unsubscription management (no ngOnDestroy cleanup needed, unlike the old RxJS Subject-based i18n patterns) — Angular's reactivity graph handles all of it.
// 
// 


