import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideSpartanHlm } from '@spartan/helm/utils';
import { TRANSLATION_LOADER } from '@invento/core';
import type { Locale } from '@invento/core';
import en from '@invento/invento/assets/i18n/en.json';
import ar from '@invento/invento/assets/i18n/ar.json';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(appRoutes),
    provideSpartanHlm(),
    {
      provide: TRANSLATION_LOADER,
      useValue: (locale: Locale) => (locale === 'ar' ? ar : en),
    },
  ],
};
