import {
  Component,
  OnDestroy,
  afterNextRender,
  computed,
  inject,
  signal,
  ElementRef,
  viewChild,
  viewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgStyle } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideDownload,
  lucideExternalLink,
  lucideRefreshCw,
  lucideSmartphoneCharging,
  lucideTablet,
  lucideTvMinimal,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan/helm/button';
import { ThemeSuggestion } from '@/app/shared/interfaces/preview/themeSuggestion';
import { PreviewSize, PreviewViewport, Viewport } from '@/app/shared/interfaces/preview/ViewPort';
import { PreviewDataClient } from '@/app/core/service/preview-data-client';
import { PageHeader } from '@/app/components/page-header/page-header';
import { HlmDialogImports } from '@spartan/helm/dialog';
import { HlmLabelImports } from '@spartan/helm/label';

@Component({
  selector: 'app-preview',
  imports: [PageHeader, HlmButtonImports, HlmDialogImports, HlmLabelImports, NgIcon, NgStyle],
  providers: [
    provideIcons({
      lucideExternalLink,
      lucideDownload,
      lucideTvMinimal,
      lucideTablet,
      lucideSmartphoneCharging,
      lucideRefreshCw,
    }),
  ],
  templateUrl: './preview.html',
  styleUrl: './preview.css',
})
export class Preview implements OnDestroy {
  private readonly previewDataClientService = inject(PreviewDataClient);
  private readonly router = inject(Router);

  readonly themeSuggestions = this.previewDataClientService.themeSuggestions;
  readonly products = this.previewDataClientService.products;
  readonly navTabs = this.previewDataClientService.navTabs;
  readonly isLoading = this.previewDataClientService.isLoading;

  readonly skeletonThemes = Array(4);
  readonly skeletonProducts = Array(3);

  readonly selectedTheme = signal<ThemeSuggestion>(this.themeSuggestions()[0]);
  readonly selectedViewport = signal<PreviewViewport>('desktop');
  readonly selectedSize = signal<PreviewSize>('M');
  readonly deployDialogState = signal<'closed' | 'open'>('closed');
  readonly themeButtons = viewChildren<ElementRef<HTMLButtonElement>>('themeButton');

  private readonly _containerWidth = signal<number>(0);
  private _resizeObserver?: ResizeObserver;
  readonly previewContainerEl = viewChild<ElementRef<HTMLDivElement>>('previewContainer');

  readonly sizes: readonly PreviewSize[] = ['S', 'M', 'L', 'XL'] as const;

  readonly viewports: readonly Viewport[] = [
    { id: 'desktop', icon: 'lucideTvMinimal', label: 'Desktop', width: '100%' },
    { id: 'tablet', icon: 'lucideTablet', label: 'Tablet', width: '768px' },
    { id: 'mobile', icon: 'lucideSmartphoneCharging', label: 'Mobile', width: '390px' },
  ] as const;

  readonly previewCssVars = computed<Record<string, string>>(() => {
    const c = this.selectedTheme().colors;
    const r = this.selectedTheme().radius;
    return {
      '--background': c.background,
      '--foreground': c.foreground,
      '--primary': c.primary,
      '--primary-foreground': c.primaryForeground,
      '--secondary': c.secondary,
      '--secondary-foreground': c.secondaryForeground,
      '--accent': c.accent,
      '--destructive': c.destructive,
      '--border': c.border,
      '--ring': c.ring,
      '--radius': r,
      '--radius-sm': `calc(${r} / 2)`,
      '--radius-lg': `calc(${r} * 1.5)`,
    };
  });

  readonly simulatedPxWidth = computed<number>(() => {
    const cw = this._containerWidth();
    switch (this.selectedViewport()) {
      case 'mobile':
        return 390;
      case 'tablet':
        return 768;
      case 'desktop':
        return Math.max(cw || 1200, 1200);
      default:
        return cw || 1200;
    }
  });

  readonly previewScale = computed<number>(() => {
    const cw = this._containerWidth();
    if (cw === 0) return 1;
    return Math.min(1, cw / this.simulatedPxWidth());
  });

  readonly previewFrameStyles = computed<Record<string, string>>(() => ({
    width: `${this.simulatedPxWidth()}px`,
    zoom: String(this.previewScale()),
    transition: 'zoom 300ms ease-in-out, width 300ms ease-in-out',
  }));

  readonly previewCardCols = computed<string>(() => {
    switch (this.selectedViewport()) {
      case 'mobile':
        return 'repeat(1, minmax(0, 1fr))';
      case 'tablet':
        return 'repeat(2, minmax(0, 1fr))';
      default:
        return 'repeat(3, minmax(0, 1fr))';
    }
  });

  readonly showNavTabs = computed<boolean>(() => this.selectedViewport() !== 'mobile');

  readonly heroTextPadding = computed<Record<string, string>>(() =>
    this.selectedViewport() === 'mobile' ? { padding: '1rem' } : { padding: '1.5rem' },
  );

  readonly buildSummary = computed(() => [
    { label: 'THEME', value: this.selectedTheme().name },
    { label: 'PRODUCTS', value: `${this.products().length} items` },
    { label: 'VARIANTS', value: '11 SKUs' },
    { label: 'PAGES', value: '8 routes' },
    { label: 'STATUS', value: this.selectedViewport().toUpperCase() },
  ]);

  constructor() {
    afterNextRender(() => {
      const el = this.previewContainerEl()?.nativeElement;
      if (!el) return;
      this._resizeObserver = new ResizeObserver(([entry]) => {
        this._containerWidth.set(Math.floor(entry.contentRect.width));
      });
      this._resizeObserver.observe(el);
    });
  }

  confirmDeployment(ctx: { close: (result?: unknown) => void }): void {
    ctx.close();
    queueMicrotask(() => this.router.navigate(['/validation']));
  }

  cancelDeployment(ctx: { close: (result?: unknown) => void }): void {
    ctx.close();
    queueMicrotask(() => {
      const index = this.themeSuggestions().findIndex((t) => t.id === this.selectedTheme().id);
      this.themeButtons()[index]?.nativeElement.focus();
    });
  }

  ngOnDestroy(): void {
    this._resizeObserver?.disconnect();
  }
}
