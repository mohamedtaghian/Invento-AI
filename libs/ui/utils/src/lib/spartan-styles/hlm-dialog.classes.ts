import type { HlmStyle } from './hlm-style';

export const dialogContentClasses: Record<HlmStyle, string> = {
  nova: 'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 grid max-w-[calc(100%-2rem)] gap-4 rounded-xl p-4 text-sm ring-1 duration-100 sm:max-w-sm relative mx-auto w-full outline-none sm:mx-0',
  vega: 'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 grid max-w-[calc(100%-2rem)] gap-6 rounded-xl p-6 text-sm ring-1 duration-100 sm:max-w-md relative mx-auto w-full outline-none sm:mx-0',
  lyra: 'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 grid max-w-[calc(100%-2rem)] gap-4 rounded-none p-4 text-xs/relaxed ring-1 duration-100 sm:max-w-sm relative mx-auto w-full outline-none sm:mx-0',
  maia: 'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/5 grid max-w-[calc(100%-2rem)] gap-6 rounded-4xl p-6 text-sm ring-1 duration-100 sm:max-w-md relative mx-auto w-full outline-none sm:mx-0',
  mira: 'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 grid max-w-[calc(100%-2rem)] gap-4 rounded-xl p-4 text-xs/relaxed ring-1 duration-100 sm:max-w-sm relative mx-auto w-full outline-none sm:mx-0',
  luma: 'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/5 dark:ring-foreground/10 grid max-w-[calc(100%-2rem)] gap-6 rounded-4xl p-6 text-sm shadow-xl ring-1 duration-100 sm:max-w-md relative mx-auto w-full outline-none sm:mx-0',
};

export const dialogDescriptionClasses: Record<HlmStyle, string> = {
  nova: 'text-muted-foreground text-sm',
  vega: 'text-muted-foreground text-sm',
  lyra: 'text-muted-foreground text-xs/relaxed',
  maia: 'text-muted-foreground text-sm',
  mira: 'text-muted-foreground text-xs/relaxed',
  luma: 'text-muted-foreground text-sm',
};

export const dialogFooterClasses: Record<HlmStyle, string> = {
  nova: 'flex flex-col-reverse sm:flex-row sm:justify-end gap-2',
  vega: 'flex flex-col-reverse sm:flex-row sm:justify-end gap-2',
  lyra: 'flex flex-col-reverse sm:flex-row sm:justify-end gap-2',
  maia: 'flex flex-col-reverse sm:flex-row sm:justify-end gap-2',
  mira: 'flex flex-col-reverse sm:flex-row sm:justify-end gap-2',
  luma: 'flex flex-col-reverse sm:flex-row sm:justify-end gap-2',
};

export const dialogHeaderClasses: Record<HlmStyle, string> = {
  nova: 'flex flex-col gap-1.5 text-center sm:text-left',
  vega: 'flex flex-col gap-1.5 text-center sm:text-left',
  lyra: 'flex flex-col gap-1.5 text-center sm:text-left',
  maia: 'flex flex-col gap-1.5 text-center sm:text-left',
  mira: 'flex flex-col gap-1.5 text-center sm:text-left',
  luma: 'flex flex-col gap-1.5 text-center sm:text-left',
};

export const dialogTitleClasses: Record<HlmStyle, string> = {
  nova: 'text-lg font-semibold leading-none tracking-tight',
  vega: 'text-lg font-semibold leading-none tracking-tight',
  lyra: 'text-base font-semibold leading-none tracking-tight',
  maia: 'text-lg font-semibold leading-none tracking-tight',
  mira: 'text-base font-semibold leading-none tracking-tight',
  luma: 'text-lg font-semibold leading-none tracking-tight',
};

export const dialogOverlayClasses: Record<HlmStyle, string> = {
  nova: 'bg-black/80 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 grid place-items-center overflow-y-auto overscroll-contain',
  vega: 'bg-black/80 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 grid place-items-center overflow-y-auto overscroll-contain',
  lyra: 'bg-black/80 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 grid place-items-center overflow-y-auto overscroll-contain',
  maia: 'bg-black/80 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 grid place-items-center overflow-y-auto overscroll-contain',
  mira: 'bg-black/80 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 grid place-items-center overflow-y-auto overscroll-contain',
  luma: 'bg-background/20 backdrop-blur-sm data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 grid place-items-center overflow-y-auto overscroll-contain',
};

export const dialogCloseButtonClasses: Record<HlmStyle, string> = {
  nova: 'text-muted-foreground data-open:ring-ring/50 hover:bg-muted absolute end-3 top-3 rounded-xs p-0.5 transition-[color,box-shadow] outline-none focus-visible:ring-[3px] [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
  vega: 'text-muted-foreground data-open:ring-ring/50 hover:bg-muted absolute end-3 top-3 rounded-xs p-0.5 transition-[color,box-shadow] outline-none focus-visible:ring-[3px] [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
  lyra: 'text-muted-foreground data-open:ring-ring/50 hover:bg-muted absolute end-3 top-3 rounded-xs p-0.5 transition-[color,box-shadow] outline-none focus-visible:ring-[3px] [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
  maia: 'text-muted-foreground data-open:ring-ring/50 hover:bg-muted absolute end-3 top-3 rounded-xs p-0.5 transition-[color,box-shadow] outline-none focus-visible:ring-[3px] [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
  mira: 'text-muted-foreground data-open:ring-ring/50 hover:bg-muted absolute end-3 top-3 rounded-xs p-0.5 transition-[color,box-shadow] outline-none focus-visible:ring-[3px] [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
  luma: 'text-muted-foreground data-open:ring-ring/50 hover:bg-accent absolute end-3 top-3 rounded-2xl p-0.5 transition-[color,box-shadow] outline-none focus-visible:ring-[3px] [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
};
