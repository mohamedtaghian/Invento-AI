import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideSpartanHlm } from '@spartan/helm/utils';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
  withNoIncrementalHydration,
} from '@angular/platform-browser';
import { HlmStyleService } from '@spartan/styles';
import { TRANSLATION_LOADER } from '@invento/core';
import type { Locale } from '@invento/core';
import en from '@invento/site-builder/assets/i18n/en.json';
import ar from '@invento/site-builder/assets/i18n/ar.json';

// TO have only One instance exists for the entire application -> if we didn't provide service here it'll be provided according to each comp so each comp has it's own instance
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    HlmStyleService,
    provideSpartanHlm(),
    {
      provide: TRANSLATION_LOADER,
      useValue: (locale: Locale) => (locale === 'ar' ? ar : en),
    },
  ],
};
