import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { ApiConfig } from '@/app/core/config/api-config';

/** Path prefixes that belong to our API and therefore need the bearer token. */
const API_PREFIXES = ['/site-builder', '/generate-theme'];

/**
 * Attaches the API bearer token to our own API calls.
 *
 * Replaces the per-service header assembly that used to live in every
 * *-api.ts. Scoped by prefix so third-party or asset requests never leak
 * the token.
 */
export const apiAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(ApiConfig);
  if (!config.apiKey || !isApiRequest(req.url, config.baseUrl)) {
    return next(req);
  }

  return next(
    req.clone({ setHeaders: { Authorization: `Bearer ${config.apiKey}` } }),
  );
};

function isApiRequest(url: string, baseUrl: string): boolean {
  const path = baseUrl && url.startsWith(baseUrl) ? url.slice(baseUrl.length) : url;
  return API_PREFIXES.some((prefix) => path.startsWith(prefix));
}
