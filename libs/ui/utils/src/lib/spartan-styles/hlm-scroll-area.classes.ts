import type { HlmStyle } from './hlm-style';

export const scrollAreaClassesByStyle: Record<HlmStyle, string> = {
  nova: 'rounded-lg [--scrollbar-thumb-shape:9999px] block',
  vega: 'rounded-md [--scrollbar-thumb-shape:9999px] block',
  lyra: 'rounded-none [--scrollbar-thumb-shape:0px] block',
  maia: 'rounded-2xl [--scrollbar-thumb-shape:9999px] block',
  mira: 'rounded-lg [--scrollbar-thumb-shape:6px] block',
  luma: 'rounded-3xl [--scrollbar-thumb-shape:9999px] block',
};
