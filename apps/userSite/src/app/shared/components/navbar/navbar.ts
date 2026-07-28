import { Component, inject } from '@angular/core';
import { HlmNavigationMenuImports } from '@spartan/helm/navigation-menu';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { HlmSheetImports } from '@spartan/helm/sheet';
import { HlmButtonImports } from '@spartan/helm/button';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  imports: [
    HlmNavigationMenuImports,
    RouterLink,
    HlmSheetImports,
    HlmButtonImports,
    RouterLinkActive,
  ],
  templateUrl: './navbar.html',
})
export class Navbar {
  private readonly router = inject(Router);

  protected readonly links: NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/products' },
    { label: 'Orders', path: '/orders' },
    { label: 'FAQ', path: '/FAQ' },
  ];

  protected readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );
}
