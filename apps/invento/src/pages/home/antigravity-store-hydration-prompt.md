Hydrate the Home Page Editor from `GET /site/{slug}`

This continues the earlier Hero-PATCH integration work on `home.ts` / `home.html` (component selector `app-home`). That work left a TODO: the editor still opens with hardcoded placeholder copy instead of the store's real data. This endpoint fixes that.

## 1. Investigate first

- The spec below shows the path as `/site/layali` — `layali` is almost certainly just the example store used to generate this doc, not a hardcoded segment. Confirm with the actual backend/route table whether it's `/site/{slug}` (or similar), and find where the _current_ store's slug already lives in this app (route param, `currentStore` signal, an app-wide store service, auth/session data, etc.) rather than hardcoding one.
- This endpoint is **public** (`tags: site (public)`, `security: []`) — do **not** attach an `Authorization` header to this call.
- Reuse the same HTTP service/service-location conventions established for the Hero PATCH work (same `StoreService` if one was created, same base-URL/environment pattern).

## 2. Backend contract (already defined, do not change)

```
GET /site/{slug}
```

No auth header. Response `200`:

```ts
interface StoreResponse {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  logoSource: string;
  locale: string;
  currency: string;
  hero: {
    imageUrl: string;
    headline: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string | null;
  };
  theme: unknown; // full design-token object — not consumed by this component, type loosely or skip
  featuredCategories: Array<{
    name: string;
    slug: string;
    description: string;
    imageUrl: string | null;
  }>;
}
```

Response `404` (store not found):

```ts
interface StoreNotFoundResponse {
  message: string;
  error: string;
  statusCode: number;
}
```

## 3. Fetch on init

Add an init hook (`ngOnInit` or equivalent) that calls `storeService.getStore(slug)` when the Home Page Editor loads. Add supporting state:

```ts
isLoadingStore = signal<boolean>(true);
storeLoadError = signal<string | null>(null);
storeData = signal<StoreResponse | null>(null); // keep the raw response around for future features
```

Show a lightweight loading indicator in the editor panel while `isLoadingStore()` is true (reuse whatever loading pattern already exists in the dashboard, if any). On `404` or any request failure, set `storeLoadError` to a readable message, leave the current placeholder defaults in place (don't crash, don't block editing), and surface the error using whatever error/toast pattern was used for the Hero PATCH work.

## 4. Hydrate the Hero fields

On a successful response, map `response.hero` into the existing signals (`heroTitle`, `heroSubtitle`, `heroCtaLabel`, `heroCtaHref`, `heroImageUrl`) using the same `headline → heroTitle` / `subtitle → heroSubtitle` mapping established for the PATCH work. Also set the "last saved" snapshot (added for the `discard()` fix) from this same data, so Discard reverts to the real saved state, not the placeholder.

**Guard against clobbering in-progress edits:** if the user has already changed something before the fetch resolves (i.e. `isSaved()` is already `false` when the response comes back), skip overwriting the live signals — just update `storeData` and the "last saved" snapshot, and leave the user's edits alone.

## 5. Hydrate Categories (read-only sync — there's still no write endpoint for categories)

Map `response.featuredCategories` into the existing `Category[]` list (`id`, `name`, `icon`) **only if the category list hasn't already been edited locally** (same dirty-check as step 4):

- `name` → `Category.name`
- Use `slug` as `Category.id` if that gives more stable IDs than `Date.now()`-based ones; otherwise keep the existing ID scheme — your call, just be consistent.
- `icon` has **no equivalent in the API** (the API has `imageUrl`, which is `null` in the example, and the local model has no image field at all). Leave `icon` at its current default/placeholder for these categories rather than guessing. Add a `// TODO:` noting the mismatch between the local emoji-`icon` model and the backend's `imageUrl` field — this needs reconciling once a categories write endpoint exists.
- `description` isn't used by any current UI — don't add it to the `Category` interface unless you're already touching it for the `id` change above; if you do add it, keep it optional and unused for now.

Categories editing (`addCategory`, `removeCategory`, `updateCategoryIcon`, `updateCategoryName`) stays exactly as it is otherwise — this step only changes the _initial_ values the list loads with.

## Out of scope — do not touch

- `name`, `description`, `logoUrl`, `logoSource`, `locale`, `currency`, `theme` — none of these have UI in the Home Page Editor. Keep them on `storeData()` for potential future use, but don't render or bind them anywhere.
- Featured Products section — this endpoint has no product data.
- Anything already covered by the Hero PATCH prompt (saving, the CTA inputs, the file-upload tracking, the loading-button state) — this prompt only adds the initial `GET`.

## When you're done

Tell me: what slug source you ended up using, whether you found (or had to guess at) the real route pattern, and how you're distinguishing "still loading" from "loaded but store has no data" in the UI.
