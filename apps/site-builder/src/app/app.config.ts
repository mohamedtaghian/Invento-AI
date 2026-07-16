import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
  withNoIncrementalHydration,
} from '@angular/platform-browser';
import { HlmStyleService } from '@spartan/styles';

// TO have only One instance exists for the entire application -> if we didn't provide service here it'll be provided according to each comp so each comp has it's own instance
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    HlmStyleService,
  ],
};
