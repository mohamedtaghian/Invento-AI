import { Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan/helm/button';
import { HlmBadgeImports } from '@spartan/helm/badge';
import { HlmInputImports } from '@spartan/helm/input';
import { HlmTextareaImports } from '@spartan/helm/textarea';
import { HlmLabelImports } from '@spartan/helm/label';
import { HlmSeparatorImports } from '@spartan/helm/separator';
import { HlmCardImports } from '@spartan/helm/card';
import { HlmAvatarImports } from '@spartan/helm/avatar';
import { HlmItemImports } from '@spartan/helm/item';
import type { HlmStyle } from '@spartan/styles';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type ButtonSize =
  | 'default'
  | 'xs'
  | 'sm'
  | 'lg'
  | 'icon'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-lg';
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';

const STYLE_LIST: HlmStyle[] = ['nova', 'vega', 'lyra', 'maia', 'mira', 'luma'];

const BUTTON_VARIANTS: ButtonVariant[] = [
  'default',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
];
const BUTTON_SIZES: ButtonSize[] = ['xs', 'sm', 'default', 'lg', 'icon'];

const BADGE_VARIANTS: BadgeVariant[] = [
  'default',
  'secondary',
  'outline',
  'destructive',
  'ghost',
  'link',
];

@Component({
  selector: 'app-style-test',
  standalone: true,
  imports: [
    HlmButtonImports,
    HlmBadgeImports,
    HlmInputImports,
    HlmTextareaImports,
    HlmLabelImports,
    HlmSeparatorImports,
    HlmCardImports,
    HlmAvatarImports,
    HlmItemImports,
  ],
  templateUrl: './style-test.html',
  styleUrl: './style-test.css',
})
export class StyleTest {
  readonly styles = STYLE_LIST;
  readonly activeStyle = signal<HlmStyle>('vega');
  readonly buttonVariants = BUTTON_VARIANTS;
  readonly buttonSizes = BUTTON_SIZES;
  readonly badgeVariants = BADGE_VARIANTS;

  setStyle(style: HlmStyle) {
    this.activeStyle.set(style);
  }
}
