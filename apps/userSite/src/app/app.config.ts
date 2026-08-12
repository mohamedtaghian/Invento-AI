import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideRouter, withViewTransitions, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { TRANSLATION_LOADER } from '@invento/core';
import type { Locale } from '@invento/core';
import en from '@invento/user-site/assets/i18n/en.json';
import ar from '@invento/user-site/assets/i18n/ar.json';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes, 
      withViewTransitions(), 
      withRouterConfig({ paramsInheritanceStrategy: 'always' })
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: TRANSLATION_LOADER,
      useValue: (locale: Locale) => (locale === 'ar' ? ar : en),
    },
  ],
};
