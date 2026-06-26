export type PreviewViewport = 'desktop' | 'tablet' | 'mobile';
export type PreviewSize = 'S' | 'M' | 'L' | 'XL';

export interface Viewport {
  readonly id: PreviewViewport;
  readonly icon: string;
  readonly label: string;
  readonly width: string;
}
