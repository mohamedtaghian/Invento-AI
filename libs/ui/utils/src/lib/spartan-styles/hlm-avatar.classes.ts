import type { HlmStyle } from './hlm-style';

/** All 6 Avatar sub-components are style-invariant (identical class strings across styles). */

export const avatarClasses: Record<HlmStyle, string> = {
  nova: 'size-8 rounded-full after:rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 group/avatar after:border-border relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten',
  vega: 'size-8 rounded-full after:rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 group/avatar after:border-border relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten',
  lyra: 'size-8 rounded-full after:rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 group/avatar after:border-border relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten',
  maia: 'size-8 rounded-full after:rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 group/avatar after:border-border relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten',
  mira: 'size-8 rounded-full after:rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 group/avatar after:border-border relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten',
  luma: 'size-8 rounded-full after:rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 group/avatar after:border-border relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten',
};

export const avatarBadgeClasses: Record<HlmStyle, string> = {
  nova: 'bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>ng-icon]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>ng-icon]:text-[length:--spacing(2)] group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>ng-icon]:text-[length:--spacing(2)]',
  vega: 'bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>ng-icon]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>ng-icon]:text-[length:--spacing(2)] group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>ng-icon]:text-[length:--spacing(2)]',
  lyra: 'bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>ng-icon]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>ng-icon]:text-[length:--spacing(2)] group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>ng-icon]:text-[length:--spacing(2)]',
  maia: 'bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>ng-icon]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>ng-icon]:text-[length:--spacing(2)] group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>ng-icon]:text-[length:--spacing(2)]',
  mira: 'bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>ng-icon]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>ng-icon]:text-[length:--spacing(2)] group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>ng-icon]:text-[length:--spacing(2)]',
  luma: 'bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>ng-icon]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>ng-icon]:text-[length:--spacing(2)] group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>ng-icon]:text-[length:--spacing(2)]',
};

export const avatarFallbackClasses: Record<HlmStyle, string> = {
  nova: 'bg-muted text-muted-foreground rounded-full flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs',
  vega: 'bg-muted text-muted-foreground rounded-full flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs',
  lyra: 'bg-muted text-muted-foreground rounded-full flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs',
  maia: 'bg-muted text-muted-foreground rounded-full flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs',
  mira: 'bg-muted text-muted-foreground rounded-full flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs',
  luma: 'bg-muted text-muted-foreground rounded-full flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs',
};

export const avatarGroupClasses: Record<HlmStyle, string> = {
  nova: '*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2',
  vega: '*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2',
  lyra: '*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2',
  maia: '*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2',
  mira: '*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2',
  luma: '*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2',
};

export const avatarGroupCountClasses: Record<HlmStyle, string> = {
  nova: 'bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>ng-icon]:text-base group-has-data-[size=lg]/avatar-group:[&>ng-icon]:text-xl group-has-data-[size=sm]/avatar-group:[&>ng-icon]:text-xs',
  vega: 'bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>ng-icon]:text-base group-has-data-[size=lg]/avatar-group:[&>ng-icon]:text-xl group-has-data-[size=sm]/avatar-group:[&>ng-icon]:text-xs',
  lyra: 'bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>ng-icon]:text-base group-has-data-[size=lg]/avatar-group:[&>ng-icon]:text-xl group-has-data-[size=sm]/avatar-group:[&>ng-icon]:text-xs',
  maia: 'bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>ng-icon]:text-base group-has-data-[size=lg]/avatar-group:[&>ng-icon]:text-xl group-has-data-[size=sm]/avatar-group:[&>ng-icon]:text-xs',
  mira: 'bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>ng-icon]:text-base group-has-data-[size=lg]/avatar-group:[&>ng-icon]:text-xl group-has-data-[size=sm]/avatar-group:[&>ng-icon]:text-xs',
  luma: 'bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>ng-icon]:text-base group-has-data-[size=lg]/avatar-group:[&>ng-icon]:text-xl group-has-data-[size=sm]/avatar-group:[&>ng-icon]:text-xs',
};

export const avatarImageClasses: Record<HlmStyle, string> = {
  nova: 'rounded-full aspect-square size-full object-cover',
  vega: 'rounded-full aspect-square size-full object-cover',
  lyra: 'rounded-full aspect-square size-full object-cover',
  maia: 'rounded-full aspect-square size-full object-cover',
  mira: 'rounded-full aspect-square size-full object-cover',
  luma: 'rounded-full aspect-square size-full object-cover',
};
