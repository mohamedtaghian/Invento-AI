You're working in an Angular (standalone components) admin dashboard project. I need you to finish the "Home Page Editor" feature in `home.ts` / `home.html` / `home.css` (component selector `app-home`). Specifically: add the missing Hero CTA UI, and connect the Hero section to the real backend. **Leave Categories and Featured Products exactly as they are** — those sections have no backend endpoint defined yet, so don't invent one or restructure them.

## 1. Investigate first, match existing conventions

Before writing anything, check how the rest of the app already talks to the backend so this doesn't introduce a new pattern:

- Is `HttpClient` already provided (`provideHttpClient` in the app config)? If not, add it.
- Is there an existing `environment.ts` / `environment.prod.ts` with an API base URL? Use it — don't hardcode a URL.
- Is there an existing auth interceptor / `AuthService` / token storage that already attaches `Authorization: Bearer <token>` to outgoing requests? If yes, rely on it. If no, tell me what you found and use whatever storage key/service other admin pages use to read the token.
- Is there an existing toast/notification service, or an established inline-error pattern? Match it — don't invent a new error UI.
- Is there an existing `StoreService` / `StorefrontService` (or similar) where store API calls already live? Add the hero call there. If nothing like that exists, create `store.service.ts` next to the other services, following their naming/DI style.

## 2. Backend contract (already defined, do not change)

```
PATCH /stores/me/hero
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

Form fields (send all of these; `image` is the only one that's conditional):

- `image` — binary file, **only include it if the user picked a new file this session**
- `headline` — string
- `subtitle` — string
- `ctaLabel` — string
- `ctaHref` — string

Response `200`:

```ts
interface HeroSectionResponse {
  imageUrl: string;
  headline: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string | null;
}
```

Gotcha: when using Angular's `HttpClient` with a `FormData` body, do **not** manually set the `Content-Type` header — let the browser set it (with the correct multipart boundary) automatically.

## 3. Add the missing CTA UI

In `home.ts`, add two new signals and their handlers, following the exact same pattern as `onHeroTitleChange` / `onHeroSubtitleChange` (update the signal, then `this.isSaved.set(false)`):

```ts
heroCtaLabel = signal<string>('Shop Now');
heroCtaHref = signal<string>('');
```

In `home.html`, inside the "Hero Content" block of the Hero Editor Card, after the Subtitle field, add two new inputs styled identically to the existing Title/Subtitle inputs:

- **Button Text** → bound to `heroCtaLabel()`
- **Button Link** → bound to `heroCtaHref()`, `type="url"`, placeholder like `https://yourbrand.com/shop`

In the live preview pane, the primary hero button (currently hardcoded text `Shop Now`) should render `{{ heroCtaLabel() }}`, and on click should open `heroCtaHref()` in a new tab (reuse the same `window.open` approach as `openLive()`; guard against an empty href — don't open a blank tab). **Leave the secondary "Explore AI" button untouched** — it isn't part of this API and is out of scope.

## 4. Track the actual File for upload

`onFileSelected()` currently only produces a base64 data URL (`heroImageUrl`) for preview. Keep that for preview, but also add:

```ts
heroImageFile = signal<File | null>(null);
```

Set it alongside `heroImageUrl` inside `onFileSelected()`, and reset it to `null` after a successful save (so an unchanged image is never re-uploaded on the next save).

## 5. Resolve the naming mismatch (don't rename signals in the template)

The component calls these fields `heroTitle` / `heroSubtitle`; the API calls them `headline` / `subtitle`. Keep the component-facing signal names as-is — only the service/API-mapping layer should translate `heroTitle → headline` and `heroSubtitle → subtitle` when building the request and reading the response.

## 6. Wire up saving

Rewrite `saveChanges()` for the hero portion only (leave Categories/Products logic untouched) so it:

1. Adds `isSavingHero = signal<boolean>(false)` and `heroSaveError = signal<string | null>(null)`; sets saving `true` and clears the error.
2. Builds a `FormData`: always append `headline`, `subtitle`, `ctaLabel`, `ctaHref`; append `image` only if `heroImageFile()` is not `null`.
3. Calls a service method, e.g. `storeService.updateHero(formData)`, which sends the `PATCH` to `{apiBaseUrl}/stores/me/hero`.
4. On success: update `heroImageUrl`, `heroTitle`, `heroSubtitle`, `heroCtaLabel`, `heroCtaHref` from the response, set `heroImageFile.set(null)`, `isSaved.set(true)`, `isSavingHero.set(false)`, and update the "last saved" snapshot (see §7).
5. On error: set `heroSaveError` to a readable message, `isSavingHero.set(false)`, and surface it using whatever pattern you found in step 1.

## 7. Fix `discard()`

Right now `discard()` only sets `isSaved.set(true)` — it doesn't revert any field, so Discard currently just hides the "unsaved" indicator without discarding anything. Fix this:

- Keep a "last saved" snapshot (signal or plain object) holding the last-persisted `heroTitle`, `heroSubtitle`, `heroImageUrl`, `heroCtaLabel`, `heroCtaHref` — set it on load and again after every successful save.
- Have `discard()` reset the live signals back to that snapshot, clear `heroImageFile`, then set `isSaved.set(true)`.

## 8. Loading state on Save

While `isSavingHero()` is `true`, disable the Save button (in addition to the existing `isSaved()` check) and swap its label/icon for a loading state ("Saving…" or a spinner) — match whatever loading-button pattern already exists elsewhere in the dashboard, if one does.

## 9. Hydrate real data on load

Add an init hook that loads the current hero section when the component mounts:

- If a `GET` for this already exists, or the store's data is already available from a parent component / resolver / app-wide store service (e.g. a `currentStore` signal used elsewhere in the dashboard), hydrate `heroTitle`, `heroSubtitle`, `heroImageUrl`, `heroCtaLabel`, `heroCtaHref` from it instead of the hardcoded placeholder copy, and set the initial "last saved" snapshot from the same data.
- If nothing like that exists yet, leave the current placeholder defaults and add a `// TODO:` noting hero data isn't hydrated from the backend yet.

## Out of scope — do not touch

- Categories section and its handlers (`addCategory`, `removeCategory`, `updateCategoryIcon`, `updateCategoryName`).
- Featured Products section (`toggleProduct`).
- Existing visual design/styling — reuse the current Tailwind classes for the new CTA inputs; don't restyle anything else.

## When you're done

Give me a short summary of every file you touched or created, and flag any assumptions you had to make (auth token source, API base URL, toast/error pattern, where store data is hydrated from) so I can double check them.
