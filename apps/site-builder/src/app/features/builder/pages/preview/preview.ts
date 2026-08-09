import {
  Component,
  HostListener,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
  ElementRef,
  viewChild,
  viewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { NgStyle } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideDownload,
  lucideMaximize2,
  lucideMinimize2,
  lucideSmartphoneCharging,
  lucideTablet,
  lucideTvMinimal,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan/helm/button';
import { ThemeSuggestion } from '@/app/core/interface/Preview';
import { PreviewSize, PreviewViewport, Viewport } from '@/app/core/interface/Preview';
import { PreviewDataClient } from '@/app/core/service/preview-data-client';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { HlmDialogImports } from '@spartan/helm/dialog';
import { BuilderState } from '@/app/features/builder/services/builder-state';
import { ContainerWidth } from '@/app/shared/components/container-width/container-width';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { hlmH2, hlmH3, hlmH4, hlmP } from '@spartan/helm/typography';
import { DoubleSlash } from '@/app/shared/components/double-slash/double-slash';
import { LocaleService, TranslatePipe } from '@invento/core';

@Component({
  selector: 'app-preview',
  imports: [
    PageHeader,
    HlmButtonImports,
    HlmDialogImports,
    NgIcon,
    NgStyle,
    ContainerWidth,
    DoubleSlash,
    TranslatePipe,
  ],
  providers: [
    provideIcons({
      lucideDownload,
      lucideTvMinimal,
      lucideTablet,
      lucideSmartphoneCharging,
      lucideMaximize2,
      lucideMinimize2,
      lucideChevronRight,
    }),
  ],
  templateUrl: './preview.html',
  styleUrl: './preview.css',
})
export class Preview {
  protected readonly hlmH2 = hlmH2;
  protected readonly hlmH3 = hlmH3;
  protected readonly hlmH4 = hlmH4;
  protected readonly hlmP = hlmP;
  private readonly builderState = inject(BuilderState);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly _localeService = inject(LocaleService);

  private readonly previewDataClientService = inject(PreviewDataClient);
  readonly themeSuggestions = this.previewDataClientService.themeSuggestions;
  readonly products = this.previewDataClientService.products;
  readonly navTabs = this.previewDataClientService.navTabs;
  readonly isLoading = this.previewDataClientService.isLoading;

  readonly themeError = this.previewDataClientService.themeError;
  readonly skeletonThemes = Array(4);
  readonly skeletonProducts = Array(3);
  readonly selectedTheme = signal<ThemeSuggestion>(this.themeSuggestions()[0]);
  readonly selectedViewport = signal<PreviewViewport>('desktop');
  readonly selectedSize = signal<PreviewSize>('M');
  readonly deployDialogState = signal<'closed' | 'open'>('closed');
  readonly focusMode = signal(false);
  readonly themeButtons = viewChildren<ElementRef<HTMLButtonElement>>('themeButton');
  readonly previewCaptureRef = viewChild<ElementRef<HTMLElement>>('previewCapture');
  readonly focusContainerRef = viewChild<ElementRef<HTMLElement>>('focusContainer');
  protected readonly _containerWidth = signal<number>(0);
  readonly sizes: readonly PreviewSize[] = ['S', 'M', 'L', 'XL'] as const;

  private readonly sizeFactors: Record<PreviewSize, number> = { S: 0.8, M: 1.0, L: 1.2, XL: 1.5 };

  readonly viewports: readonly Viewport[] = [
    { id: 'desktop', icon: 'lucideTvMinimal', label: 'preview_desktop', width: '100%' },
    { id: 'tablet', icon: 'lucideTablet', label: 'preview_tablet', width: '768px' },
    { id: 'mobile', icon: 'lucideSmartphoneCharging', label: 'preview_mobile', width: '390px' },
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
  readonly sizeScale = computed(() => this.sizeFactors[this.selectedSize()]);
  readonly previewScale = computed<number>(() => {
    const cw = this._containerWidth();
    if (cw === 0) return 1;
    return Math.min(1, cw / this.simulatedPxWidth()) * this.sizeScale();
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
  readonly brandName = computed(
    () => this.builderState.businessName() || this.builderState.brainstorm() || 'InventoAI',
  );
  readonly featuredProduct = computed(() => this.products()[0] || null);
  readonly deployChevron = computed(() =>
    this._localeService.isRtl() ? 'lucideChevronLeft' : 'lucideChevronRight',
  );
  readonly buildSummary = computed(() => [
    { label: 'preview_theme', value: this._localeService.translate(this.selectedTheme().name) },
    {
      label: 'preview_products',
      value: this._localeService.translate('build_items', { n: this.products().length }),
    },
    {
      label: 'preview_variants',
      value: this._localeService.translate('build_skus', { n: this.products().length * 4 }),
    },
    {
      label: 'preview_pages',
      value: this._localeService.translate('build_routes', { n: this.navTabs().length + 4 }),
    },
    { label: 'preview_status', value: this.selectedViewport().toUpperCase() },
  ]);

  private readonly _userHasManuallySelectedTheme = signal(false);
  private readonly _dismissedError = signal(false);
  readonly showError = computed(() => this.themeError() && !this._dismissedError());

  constructor() {
    this.previewDataClientService.loadThemes();

    effect(() => {
      if (!this.previewDataClientService.isLoading()) {
        this.builderState.isNavigating.set(false);
      }
    });

    effect(() => {
      const themes = this.themeSuggestions();
      const firstTheme = themes[0];
      if (firstTheme && !this._userHasManuallySelectedTheme()) {
        this.selectedTheme.set(firstTheme);
      }
    });
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    if (!document.fullscreenElement) {
      this.focusMode.set(false);
    }
  }

  async toggleFocusMode(): Promise<void> {
    if (this.focusMode()) {
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          /* ignore */
        }
      }
      this.focusMode.set(false);
    } else {
      this.focusMode.set(true);
      const el = this.focusContainerRef()?.nativeElement;
      if (el && isPlatformBrowser(this.platformId)) {
        try {
          await el.requestFullscreen();
        } catch {
          /* ignore (user gesture may be missing) */
        }
      }
    }
  }

  private readonly _exporting = signal(false);
  readonly isExporting = this._exporting.asReadonly();

  dismissError(): void {
    this._dismissedError.set(true);
  }

  async exportPreview(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = this.previewCaptureRef()?.nativeElement;
    if (!el) return;

    this._exporting.set(true);
    try {
      const canvas = await html2canvas(el, {
        useCORS: true,
        scale: 2,
        onclone: (clonedDoc) => {
          const ctx = document.createElement('canvas').getContext('2d')!;
          const colorProps = [
            'color',
            'backgroundColor',
            'borderColor',
            'borderTopColor',
            'borderRightColor',
            'borderBottomColor',
            'borderLeftColor',
          ];
          clonedDoc.querySelectorAll('*').forEach((node: Element) => {
            const n = node as HTMLElement;
            for (const prop of colorProps) {
              const val = n.style[prop as unknown as number];
              if (val && val.includes('oklch')) {
                ctx.fillStyle = 'rgb(0,0,0)';
                ctx.fillStyle = val;
                ctx.fillRect(0, 0, 1, 1);
                const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                n.style[prop as unknown as number] = `rgb(${r},${g},${b})`;
              }
            }
          });
        },
      });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'theme-preview.png';
        a.click();
        URL.revokeObjectURL(url);
        this._exporting.set(false);
      });
    } catch {
      this._exporting.set(false);
    }
  }

  confirmDeployment(ctx: { close: (result?: unknown) => void }): void {
    ctx.close();
    this.builderState.selectedTheme.set(this.selectedTheme().id);
    this.router.navigate(['/build/validation']);
  }
  cancelDeployment(ctx: { close: (result?: unknown) => void }): void {
    ctx.close();
    queueMicrotask(() => {
      const index = this.themeSuggestions().findIndex((t) => t.id === this.selectedTheme().id);
      this.themeButtons()[index]?.nativeElement.focus();
    });
  }
}
