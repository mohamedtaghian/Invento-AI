import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmSidebarImports } from '@spartan/helm/sidebar';
import {
  lucideLayoutDashboard,
  lucidePackage,
  lucideUsers,
  lucideShoppingCart,
  lucideTruck,
  lucideBarChart3,
  lucideBot,
  lucideFolderTree,
} from '@ng-icons/lucide';
import { TranslatePipe, LocaleService } from '@invento/core';
import { BrandLogo } from '@invento/shared';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIcon, HlmSidebarImports, TranslatePipe, BrandLogo],
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucidePackage,
      lucideUsers,
      lucideShoppingCart,
      lucideTruck,
      lucideBarChart3,
      lucideBot,
      lucideFolderTree,
    }),
  ],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private readonly localeService = inject(LocaleService);

  protected readonly sidebarSide = computed(() => (this.localeService.isRtl() ? 'right' : 'left'));
  protected readonly appName = 'app_name';

  protected readonly navItems: NavItem[] = [
    { label: 'nav_home', icon: 'lucideLayoutDashboard', route: '/home' },
    { label: 'nav_products', icon: 'lucidePackage', route: '/products' },
    { label: 'nav_categories', icon: 'lucideFolderTree', route: '/categories' },
    { label: 'nav_users', icon: 'lucideUsers', route: '/users' },
    { label: 'nav_orders', icon: 'lucideShoppingCart', route: '/orders' },
    { label: 'nav_suppliers', icon: 'lucideTruck', route: '/suppliers' },
    { label: 'nav_analytics', icon: 'lucideBarChart3', route: '/analytics' },
    { label: 'nav_ai_advisor', icon: 'lucideBot', route: '/ai-advisor' },
  ];
}
