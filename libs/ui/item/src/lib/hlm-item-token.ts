import { InjectionToken, type ValueProvider, inject } from '@angular/core';

export interface HlmItemConfig {
  variant: string;
  size: string;
}

const defaultConfig: HlmItemConfig = {
  variant: 'default',
  size: 'default',
};

const HlmItemConfigToken = new InjectionToken<HlmItemConfig>('HlmItemConfig');

export function provideHlmItemConfig(config: Partial<HlmItemConfig>): ValueProvider {
  return { provide: HlmItemConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectHlmItemConfig(): HlmItemConfig {
  return inject(HlmItemConfigToken, { optional: true }) ?? defaultConfig;
}

export interface HlmItemMediaConfig {
  variant: string;
}

const defaultMediaConfig: HlmItemMediaConfig = {
  variant: 'default',
};

const HlmItemMediaConfigToken = new InjectionToken<HlmItemMediaConfig>('HlmItemMediaConfig');

export function provideHlmItemMediaConfig(config: Partial<HlmItemMediaConfig>): ValueProvider {
  return { provide: HlmItemMediaConfigToken, useValue: { ...defaultMediaConfig, ...config } };
}

export function injectHlmItemMediaConfig(): HlmItemMediaConfig {
  return inject(HlmItemMediaConfigToken, { optional: true }) ?? defaultMediaConfig;
}
