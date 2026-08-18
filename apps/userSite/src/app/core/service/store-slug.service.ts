import { Injectable, computed, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

/**
 * The slug of the store currently being viewed, as a signal.
 *
 * The storefront is multi-tenant (`/:storeSlug/...`), and this was previously resolved three
 * different ways: the navbar and the footer each parsed router events, the home page read
 * `paramMap`, and `ProductCard` used the `environment.storeSlug` constant — which meant every
 * product link pointed at the fallback store no matter which tenant was open.
 *
 * Derived from the URL rather than `ActivatedRoute` so components outside the routed outlet
 * (navbar, footer) resolve it identically to components inside it, without each needing its
 * own subscription.
 */
@Injectable({ providedIn: 'root' })
export class StoreSlugService {
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  /**
   * Empty until the router has actually navigated.
   *
   * Deliberately without an `environment.storeSlug` fallback. During SSR `router.url` is
   * still `/` when this is first read, so a fallback made every render of every tenant also
   * fetch the fallback store — and ship that store's entire catalogue to the browser inside
   * the hydration transfer state. Callers treat `''` as "not resolved yet": `StoreService`
   * no-ops on it, and the `'' -> :storeSlug` route redirect supplies the real slug a tick
   * later.
   */
  readonly slug = computed(() => {
    const clean = this.currentUrl().split('?')[0].split('#')[0];
    return clean.split('/').filter(Boolean)[0] ?? '';
  });
}
