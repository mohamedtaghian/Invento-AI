# Task: Wire the AI Advisor dashboard panel to the real backend

You are working inside the **Invento** Angular monorepo (standalone components, OnPush change detection, Tailwind v4). A UI shell for the "AI Advisor" dashboard feature already exists but is currently unwired (mock/static data or empty). Your job is to connect it to the four real backend endpoints below — **without changing the visual design** unless a state (loading/empty/stale/error/not-found/cooldown) has no existing markup for it.

## 1. Where to work

- Entry component (already wired, do not touch): `app-ai-advisor` in `libs/invento/features/ai-advisor/ai-advisor/` — it just renders `<app-ai-advisor-panel />`.
- **Real target:** `AiAdvisorPanel`, imported from `@invento/invento/features/ai-advisor/ai-advisor-panel/ai-advisor-panel`. Locate this component first and read it fully — its current template, inputs, mock data, and any "generate/run now" button already in the markup — before writing anything. Do not guess its shape.
- If the UI also has a brief **history/past-briefs view** (list, calendar filter, pagination, and a way to open a single past brief) — locate it in the `ai-advisor` feature folder the same way. If no such UI exists yet, flag that rather than inventing one from scratch beyond minimal scaffolding.
- Locate the project's existing HTTP conventions before creating anything new: find an existing feature service that already calls this backend (base URL / environment config, auth token attachment — interceptor vs manual header, error handling pattern, RxJS vs Signals/`resource()` style). **Mirror that exact pattern.** Do not introduce a new HTTP calling convention if one already exists in the codebase.
- Since Endpoints A, C, and D all return or wrap the same `Brief` shape, share one set of types and one rendering component/template for "a brief's insight list" across the dashboard panel, the history detail view, and the post-generate state. Don't duplicate the rendering logic three times.

---

## 2. Shared types (used by Endpoints A, C, and D)

```typescript
export type InsightKind =
  | 'stockout'
  | 'restock'
  | 'trending'
  | 'slow_mover'
  | 'demand_gap'
  | 'seasonal_event'
  | 'weather';

export type InsightSeverity = 'critical' | 'warning' | 'info';
export type InsightStatus = 'new' | 'acted' | 'dismissed';
export type NarratorStatus = 'ai' | 'fallback';
export type GeneratedBy = 'schedule' | 'manual';

export interface StockoutPayload {
  productId: string;
  productTitle: string;
  variantId: string;
  variantLabel: string | null;
  unitsSoldRecent: number;
  estimatedDailyLoss: number; // minor units
}

export interface RestockPayload {
  productId: string;
  productTitle: string;
  variantId: string;
  variantLabel: string | null;
  stockQuantity: number;
  unitsPerDay: number; // 2 decimals
  daysOfCoverage: number; // 2 decimals
  recommendedQuantity: number;
  leadTimeDays: number;
}

export interface TrendingPayload {
  productId: string;
  productTitle: string;
  recentUnits: number;
  baselineUnits: number;
  ratio: number | null; // null = nothing sold in the baseline window
}

export interface SlowMoverPayload {
  productId: string;
  productTitle: string;
  stockQuantity: number;
  tiedUpAmount: number; // minor units
  daysSinceLastSale: number | null; // null = never sold at all
}

export interface DemandGapPayload {
  label: string;
  occurrences: number;
  exampleQuestion: string;
  lastAskedAt: string; // ISO date-time
}

export interface SeasonalEventPayload {
  eventKey: string;
  eventName: string;
  startsOn: string;
  daysUntil: number;
  matchedCategoryIds: string[];
  matchedCategoryNames: string[];
}

export interface WeatherPayload {
  anomaly: string;
  maxTempC: number;
  minTempC: number;
  precipitationMm: number;
  onDate: string;
}

export type InsightPayload =
  | StockoutPayload
  | RestockPayload
  | TrendingPayload
  | SlowMoverPayload
  | DemandGapPayload
  | SeasonalEventPayload
  | WeatherPayload;

export interface Insight {
  id: string; // used by PATCH /advisor/insights/{id} — see §7
  kind: InsightKind;
  severity: InsightSeverity;
  title: string; // plain text — render as text, never innerHTML
  body: string; // prose, quotes the payload's numbers in words
  payload: InsightPayload; // shape depends on `kind`, see above
  status: InsightStatus;
  statusChangedAt: string | null; // null while status === 'new'
  position: number; // render order — see rule below, never sort by anything else
}

export interface Brief {
  id: string;
  briefDate: string; // YYYY-MM-DD, store's local calendar day
  headline: string; // one-sentence summary / email subject line
  insightCount: number; // how many lines were kept, capped at 8
  generatedBy: GeneratedBy;
  narratorStatus: NarratorStatus;
  emailedAt: string | null;
  createdAt: string;
  insights: Insight[]; // position order, max 8
}

export interface BriefEnvelope {
  brief: Brief | null;
  isStale: boolean;
}
```

### Shared rendering rules for `Brief.insights` (applies to Endpoints A, C, and D)

1. **Never derive numbers from `title`/`body`.** Those are prose. All figures, ids, and links come from `payload`.
2. **Money fields (`estimatedDailyLoss`, `tiedUpAmount`) are minor units.** `11371` → `113.71 EGP`. Divide by 100.
3. **`insights` arrive pre-sorted by `position`.** Render as-is — never re-sort by severity, kind, or `createdAt`.
4. **`narratorStatus: 'fallback'`** is not an error state and needs no banner/warning.
5. **`status: 'dismissed'`** insights stay visible, just visually de-emphasized (e.g. greyed out) — don't filter them out.
6. Null-safe formatting: `ratio === null` → "with none sold before"; `daysSinceLastSale === null` → phrase as never sold; `variantLabel === null` → omit the variant line entirely.
7. Severity color coding: only `stockout` is `critical`; `restock`/`demand_gap` are `warning`; the rest `info`.
8. Render `title` as plain text, never through `innerHTML`.

---

## 3. Endpoint A — `GET /advisor/brief` (today's brief, dashboard panel)

```
GET /advisor/brief
Authorization: Bearer <token>   (required)
```

- Dashboard-only. Roles: `OWNER`/`ADMIN`. `USER` token → **403**. Missing/invalid token → **401**.
- **200 — always**, even when empty. This endpoint never 404s.
- Response: `BriefEnvelope` (see §2).

**Rules specific to this endpoint:**

- `brief: null` here specifically means **the store has never had a brief written** — render "your first brief arrives tomorrow morning". (Contrast with Endpoint D's `null`, which means something different — see §6.)
- `isStale: true` → date the brief (e.g. "from Tuesday", from `briefDate`) rather than presenting it as fresh.
- A missing insight type (e.g. no weather line) is expected — just render whatever `insights` contains, nothing to flag.
- Respect the existing `ChangeDetectionStrategy.OnPush` — whatever reactive state you introduce must trigger change detection correctly under it.

**States:** Loading · Empty (`brief === null`, "never had one") · Stale · Loaded · 401 (app's existing handling) · 403 (shouldn't be reachable for `USER`; handle gracefully if it is).

---

## 4. Endpoint B — `GET /advisor/briefs` (brief history / past briefs list)

```
GET /advisor/briefs?page=1&limit=20&from=2026-08-01&to=2026-08-31
Authorization: Bearer <token>   (required)
```

- Same auth rules as Endpoint A. **400** on a malformed date or an undeclared query param (`message` may be a string or string array).
- `page` defaults to 1. `limit` defaults to 20, max 100.
- `from`/`to` are **inclusive bounds on `briefDate`**, matched against the store's own local calendar day — send plain `YYYY-MM-DD`, no client-side timezone conversion.

```typescript
export interface BriefSummary {
  id: string;
  briefDate: string; // YYYY-MM-DD
  headline: string;
  insightCount: number;
  generatedBy: GeneratedBy;
  narratorStatus: NarratorStatus;
  emailedAt: string | null;
  createdAt: string;
  // deliberately NO `insights` — open the row via Endpoint C for those
}

export interface ListBriefsResponse {
  items: BriefSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

**Rules specific to this endpoint:**

- Rows carry no `insights` — summary table only. Each row's `id` is what you pass to Endpoint C when the user opens it.
- Results are newest-first — don't re-sort.
- `narratorStatus: 'fallback'` — same no-banner rule as Endpoint A.
- If Endpoint D (generate now) is used, today's row in this list becomes stale after a successful generate — consider invalidating/refetching this list (or at least today's row) after a successful manual generation, if the history view is visible/cached at that point.

**States:** Loading · Empty (`items: []`) · Loaded (table/list + pager + date filter) · 400 (surface near the filter controls) · 401/403.

---

## 5. Endpoint C — `GET /advisor/briefs/{id}` (open a single past brief)

```
GET /advisor/briefs/{id}     // id = uuid, from a BriefSummary.id row in Endpoint B
Authorization: Bearer <token>   (required)
```

- **200** → returns a full `Brief` (see §2, no `isStale` wrapper — a historical brief is never "stale", it just has whatever date it has).
- **400** → `id` is not a valid uuid.
- **401** → missing/invalid token.
- **403** → `USER` token.
- **404** → no such brief _in this store — including a brief id that belongs to another store entirely._ This is deliberate: the backend 404s rather than 403ing on a cross-tenant id so a 403 response can't be used to confirm an id exists. **Client-side, this just means: render a plain "brief not found" state. Do not try to distinguish "wrong store" from "doesn't exist" — the backend won't tell you which, on purpose.**

**Wiring:** clicking a row in the Endpoint B history list should navigate to (or open a panel/modal showing) this brief, reusing the same insight-rendering component/rules from §2 that Endpoint A's loaded state uses. No `isStale` handling needed here.

**States:** Loading · Loaded (reuse Endpoint A's loaded-brief rendering) · Not found (404) · 400/401/403.

---

## 6. Endpoint D — `POST /advisor/generate` ("Generate now" / "run it now" button)

```
POST /advisor/generate
Authorization: Bearer <token>   (required)
No request body.
```

- **200** (not 201 — a second press _replaces_ today's brief rather than creating another one). Response: `BriefEnvelope`, the exact same shape as Endpoint A — **on success, swap the dashboard panel's entire state from this one response** rather than refetching Endpoint A afterward.
- **401** — missing/invalid token.
- **403** — `USER` token.
- **429** — inside the **5-minute per-store cooldown** (this action costs a real Gemini call). The `message` names the seconds remaining, e.g. `"A brief was generated moments ago, please wait 243 seconds before generating another"`. Parse the number out of that string defensively (regex for digits) to drive a countdown/disabled state on the button; fall back to a generic "please wait a few minutes, try again shortly" message if parsing fails, since the exact wording isn't a guaranteed contract.

**Rules specific to this endpoint:**

- **`brief: null` here means something different from Endpoint A's null.** On this endpoint, `null` means _the collectors ran and found nothing worth saying today_ — a legitimately clean store, not "never had a brief." Use distinct copy from Endpoint A's empty state, e.g. "Nothing needs your attention today" rather than "your first brief arrives tomorrow morning."
- Generation always writes `generatedBy: 'manual'` and never triggers an email — expected, not something to reconcile against an "email sent" indicator elsewhere.
- **Dismissed/acted statuses on insights survive a regeneration** — the backend matches new signals to old rows by a stable identity key, not by wording. You don't need to (and shouldn't try to) preserve local insight `status` state across this call — just render whatever the new response says.
- This works even if the store's schedule toggle (`isEnabled`, if such a setting exists elsewhere in the app) is off — don't gate the button on that setting client-side.
- **Disable the button while the request is in flight** to prevent double-submits (each press is a real, costly generation, not idempotent-safe to fire twice).
- Cooldown state is server-authoritative — don't try to predict/enforce it client-side beyond disabling the button for the duration named in a 429 response. A failed generation clears the server's cooldown, so don't hold the button disabled locally after an error response.

**States:** Idle (button enabled) · In-flight (button disabled/spinner) · Success-with-brief (swap panel to loaded state) · Success-empty (`brief: null`, "nothing to report" copy — distinct from Endpoint A's empty copy) · 401/403 · 429 (countdown/disabled state).

---

## 7. Still not fully specified — verify before building, don't guess silently

**`PATCH /advisor/insights/{id}`** — implied by `Insight.id`'s description ("what `PATCH /advisor/insights/{id}` takes"), for marking an insight `acted` or `dismissed`. If the panel has (or needs) dismiss/mark-as-acted buttons:

- First search the codebase/API docs for the real contract.
- If genuinely not discoverable, implement conservatively against this best guess and flag it in a code comment for review:
  ```typescript
  // PATCH /advisor/insights/{id}
  // ASSUMED contract — verify against backend before shipping.
  interface UpdateInsightStatusRequest {
    status: 'acted' | 'dismissed';
  }
  ```
- Do not build against this assumption silently — surface it to me.

## 8. Acceptance checklist (verify before considering this done)

- [ ] `AiAdvisorPanel` calls `GET /advisor/brief` through a service matching the project's existing HTTP/auth conventions.
- [ ] The history UI (if present) calls `GET /advisor/briefs` with real pagination and `from`/`to` filtering.
- [ ] Opening a history row calls `GET /advisor/briefs/{id}` and reuses the shared brief/insight rendering from §2 — no duplicated rendering logic.
- [ ] The "generate now" button calls `POST /advisor/generate`, is disabled while in flight, and swaps the panel's state from the response on success rather than refetching.
- [ ] `brief: null` from Endpoint A ("never had one") and from Endpoint D ("nothing today") use distinct, correctly-worded empty states.
- [ ] A `429` from Endpoint D parses the remaining-seconds count and reflects it in a disabled/countdown button state, with a safe fallback if parsing fails.
- [ ] All response types match §2–§6 exactly, including the 7 discriminated `payload` shapes.
- [ ] Empty, stale, loading, loaded, not-found, and cooldown states all render correctly across all four endpoints.
- [ ] Insights render in `position` order; brief history renders newest-first — neither is re-sorted client-side.
- [ ] Money values are converted from minor units before display.
- [ ] `ratio: null` and `daysSinceLastSale: null` use the specific copy in §2, not raw `null`/dashes.
- [ ] `dismissed`/`acted` insight statuses are trusted from each response as-is, never preserved/merged client-side across a regeneration.
- [ ] `narratorStatus: 'fallback'` shows no error/warning UI, anywhere.
- [ ] 400 (B, C), 401, 403, 404 (C only), and 429 (D only) are handled using the app's existing error patterns.
- [ ] The 404 on Endpoint C is rendered as a plain "not found" — no logic attempting to detect the cross-tenant case.
- [ ] `from`/`to` filters are sent as plain calendar dates, no client-side timezone shifting.
- [ ] OnPush change detection still works correctly for all new reactive state.
- [ ] Any assumption made about the undocumented PATCH endpoint in §7 is explicitly flagged, not silently shipped.
