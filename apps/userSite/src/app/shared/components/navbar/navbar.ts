import { Component, inject, HostListener, signal, OnInit, computed } from '@angular/core';
import { HlmNavigationMenuImports } from '@spartan/helm/navigation-menu';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { HlmSheetImports } from '@spartan/helm/sheet';
import { HlmButtonImports } from '@spartan/helm/button';
import { CartService } from '../../../core/service/cart.service';
import { AuthService } from '../../../core/service/auth.service';
import { environment } from '../../../../environments/environment';

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
export class Navbar implements OnInit {
  private readonly router = inject(Router);
  protected readonly cartService = inject(CartService);
  protected readonly authService = inject(AuthService);

  protected links = signal<NavLink[]>([]);
  public isScrolled = signal<boolean>(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 0);
  }

  ngOnInit() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.updateLinks();
    });
    this.updateLinks();
  }

  private updateLinks() {
    const slug = this.router.url.split('/')[1] || '';
    this.links.set([
      { label: 'Home', path: `/${slug}` },
      { label: 'Shop', path: `/${slug}/products` },
      { label: 'Orders', path: `/${slug}/orders` },
      { label: 'FAQ', path: `/${slug}/faq` },
    ]);
  }

  protected readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly activeStoreSlug = computed(() => {
    const url = this.currentUrl();
    const clean = url.split('?')[0].split('#')[0];
    const segments = clean.split('/').filter(Boolean);
    return segments[0] || environment.storeSlug;
  });

  protected readonly links = computed<NavLink[]>(() => {
    const slug = this.activeStoreSlug();
    return [
      { label: 'Home', path: `/${slug}` },
      { label: 'Shop', path: `/${slug}/products` },
      { label: 'Orders', path: `/${slug}/orders` },
      { label: 'FAQ', path: `/${slug}/faq` },
    ];
  });
}
