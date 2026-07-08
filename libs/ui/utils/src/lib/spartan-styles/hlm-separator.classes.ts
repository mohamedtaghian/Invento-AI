import type { HlmStyle } from './hlm-style';

const separatorClass =
  'inline-flex shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch';

export const separatorClassesByStyle: Record<HlmStyle, string> = {
  nova: separatorClass,
  vega: separatorClass,
  lyra: separatorClass,
  maia: separatorClass,
  mira: separatorClass,
  luma: separatorClass,
};
