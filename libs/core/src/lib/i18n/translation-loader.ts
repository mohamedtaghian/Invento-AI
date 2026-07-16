import { InjectionToken } from '@angular/core';
import type { Locale } from './locale';

export type TranslationLoader = (locale: Locale) => Record<string, string>;

export const TRANSLATION_LOADER = new InjectionToken<TranslationLoader>('TRANSLATION_LOADER');
