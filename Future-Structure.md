# Site Builder → userSite Data Flow Architecture

## Current Gap

```
site-builder builder flow
  → AI generates ThemeApiResponse (rawCss, palette, style name 'nova'/'lyra'/etc.)
  → rawCss is PARSED and DISCARDED — only flat ThemeSuggestion colors kept
  → BuilderState stores only selectedTheme as string ID
  → Nothing persists to userSite (which is currently an empty shell app)
```

## Phase 1 — Fix the data pipeline in site-builder

1. **Store the full API response** — Add `rawCss`, `basePreset`, `palette`, `radius`, and business info to a new signal in `BuilderState` (or a dedicated `SiteDeploymentState`). Currently only `selectedTheme` (a string ID) is stored after deployment confirmation.

2. **Consolidate duplicated services** — `PreviewDataClient`, `Preview.ts` interface, `theme-suggestion-converter` exist in BOTH `apps/site-builder/src/app/core/` AND `libs/core/`. Migrate site-builder to use `@invento/core` exclusively to avoid drift.

3. **Create a `SiteStore` in `@invento/core`** — A signal-based store holding the full deployment payload:

   ```typescript
   interface SiteDeployment {
     rawCss: string;
     basePreset: string; // 'nova' | 'vega' | 'lyra' | 'maia' | 'mira' | 'luma'
     name: string;
     description: string;
     light: Palette;
     dark: Palette;
     radius: string;
     businessName: string;
     businessType: string;
   }
   ```

4. **Uncomment and fix `HlmStyleService.applyTheme()`** — Inject raw CSS into `<head>` using `Renderer2` or a `<style>` element with sanitized CSS.

## Phase 2 — Pass data to userSite

Since these are two separate Angular apps with separate deployments (`npm run build:userSite` produces its own `dist/`), they need a shared storage layer:

| Option                            | Mechanism                                                                              | SSR Compat                                         | Complexity |
| --------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------- |
| **A. API endpoint** (recommended) | `POST /api/sites` from builder, `GET /api/sites/:id` from userSite                     | ✅ Yes                                             | Medium     |
| **B. Static JSON export** (MVP)   | Builder writes `dist/user-site/browser/data/site.json`, userSite fetches it at runtime | ⚠️ Partial (pre-generated static)                  | Low        |
| **C. Same-origin localStorage**   | Builder stores to localStorage, userSite reads from it                                 | ❌ No (SSR fails)                                  | Very Low   |
| **D. Shared Angular service**     | Via `@invento/core` singleton                                                          | ❌ No (separate processes, different HTTP servers) | N/A        |

**For MVP (Option B):** The builder, when deploying, writes a JSON file to a known location. userSite fetches it via `fetch()` at runtime. No backend needed.

**For production (Option A):** A proper backend stores the deployment and serves it. userSite fetches the site config on load (including during SSR).

## Phase 3 — Build out userSite

- Root layout calls `HlmStyleService.applyTheme()` with fetched site data
- Inject `rawCss` as a `<style>` tag in `<head>` for global Tailwind variable resolution
- Page components (home, about, products, cart) with defaults
- Same Tailwind v4 + Spartan preset as site-builder
- `styles.css` omits hardcoded `:root`/`.dark` variables — they come entirely from generated theme

## Regarding `styles.css`

Current site-builder `styles.css` has hardcoded `:root` / `.dark` CSS variable values. For userSite, those should be **omitted** — the variables come from the generated theme's `rawCss`. userSite's `styles.css` should only contain:

```css
@import 'tailwindcss';
@plugin "tw-animate-css";
@custom-variant dark (&:is(.dark *));

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... etc — mappings only, no default values */
}
```

The actual values are injected dynamically via `HlmStyleService.applyTheme()` when userSite loads the generated site config.
