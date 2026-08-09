import { ThemeSuggestion, ThemeApiResponse } from '@/app/core/interface/Preview';
import { parseThemeCss } from '@/app/core/utils/Preview-css-parser';
import { extractPalette, extractRadius } from '@/app/core/utils/palette';

/**
 * Converts the backend's CSS-string theme response into the flat
 * ThemeSuggestion shape the rest of the app (mocks, template, component)
 * already expects.
 *
 * Only `:root` (light mode) values are used — this endpoint's response has no
 * separate dark palette, matching how MOCK_THEMES is structured.
 */
export function toThemeSuggestion(response: ThemeApiResponse): ThemeSuggestion {
  const { light } = parseThemeCss(response.rawCss);

  return {
    // basePreset isn't part of ThemeSuggestion's shape, so it's dropped here;
    // id needs to be stable and unique for @for track and selection
    // comparisons in the template — basePreset is the closest stable
    // identifier the backend gives us.
    id: response.basePreset || 'generated-theme',
    name: response.name,
    description: response.description,
    colors: extractPalette(light),
    radius: extractRadius(light),
  };
}
