import type { HlmStyle } from './hlm-style';

const breadcrumbClass = 'block';

export const breadcrumbClasses: Record<HlmStyle, string> = {
  nova: breadcrumbClass,
  vega: breadcrumbClass,
  lyra: breadcrumbClass,
  maia: breadcrumbClass,
  mira: breadcrumbClass,
  luma: breadcrumbClass,
};

export const breadcrumbListClassesByStyle: Record<HlmStyle, string> = {
  nova: 'flex flex-wrap items-center gap-2 text-sm wrap-break-word sm:gap-2.5 text-muted-foreground',
  vega: 'flex flex-wrap items-center gap-1.5 text-sm wrap-break-word sm:gap-2.5 text-muted-foreground',
  lyra: 'flex flex-wrap items-center gap-1 text-xs wrap-break-word sm:gap-2 text-muted-foreground',
  maia: 'flex flex-wrap items-center gap-2 text-sm wrap-break-word sm:gap-3 text-muted-foreground',
  mira: 'flex flex-wrap items-center gap-2 text-xs/relaxed wrap-break-word sm:gap-2.5 text-muted-foreground',
  luma: 'flex flex-wrap items-center gap-2.5 text-sm wrap-break-word sm:gap-3 text-muted-foreground',
};

export const breadcrumbItemClassesByStyle: Record<HlmStyle, string> = {
  nova: 'inline-flex items-center gap-1.5',
  vega: 'inline-flex items-center gap-1.5',
  lyra: 'inline-flex items-center gap-1',
  maia: 'inline-flex items-center gap-2',
  mira: 'inline-flex items-center gap-1.5',
  luma: 'inline-flex items-center gap-2',
};

export const breadcrumbLinkClassesByStyle: Record<HlmStyle, string> = {
  nova: 'hover:text-foreground transition-colors',
  vega: 'hover:text-foreground transition-colors',
  lyra: 'hover:text-foreground transition-colors',
  maia: 'hover:text-foreground transition-colors',
  mira: 'hover:text-foreground transition-colors',
  luma: 'hover:text-foreground transition-colors',
};

export const breadcrumbPageClassesByStyle: Record<HlmStyle, string> = {
  nova: 'text-foreground font-normal',
  vega: 'text-foreground font-normal',
  lyra: 'text-foreground font-normal',
  maia: 'text-foreground font-normal',
  mira: 'text-foreground font-normal',
  luma: 'text-foreground font-normal',
};

export const breadcrumbSeparatorClassesByStyle: Record<HlmStyle, string> = {
  nova: '[&>ng-icon]:flex [&>ng-icon]:text-[length:--spacing(3.5)]',
  vega: '[&>ng-icon]:flex [&>ng-icon]:text-[length:--spacing(3.5)]',
  lyra: '[&>ng-icon]:flex [&>ng-icon]:text-[length:--spacing(3)]',
  maia: '[&>ng-icon]:flex [&>ng-icon]:text-[length:--spacing(4)]',
  mira: '[&>ng-icon]:flex [&>ng-icon]:text-[length:--spacing(3)]',
  luma: '[&>ng-icon]:flex [&>ng-icon]:text-[length:--spacing(4)]',
};

export const breadcrumbEllipsisClassesByStyle: Record<HlmStyle, string> = {
  nova: 'flex size-5 items-center justify-center [&>ng-icon]:text-[length:--spacing(4)]',
  vega: 'flex size-5 items-center justify-center [&>ng-icon]:text-[length:--spacing(4)]',
  lyra: 'flex size-5 items-center justify-center [&>ng-icon]:text-[length:--spacing(3.5)]',
  maia: 'flex size-5 items-center justify-center [&>ng-icon]:text-[length:--spacing(4.5)]',
  mira: 'flex size-5 items-center justify-center [&>ng-icon]:text-[length:--spacing(3.5)]',
  luma: 'flex size-5 items-center justify-center [&>ng-icon]:text-[length:--spacing(4.5)]',
};
