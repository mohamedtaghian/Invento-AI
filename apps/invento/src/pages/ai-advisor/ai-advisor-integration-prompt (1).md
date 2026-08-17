# Task: Wire the AI Advisor dashboard panel to the real backend

You are working inside the **Invento** Angular monorepo (standalone components, OnPush change detection, Tailwind v4). A UI shell for the "AI Advisor" dashboard feature already exists but is currently unwired (mock/static data or empty). Your job is to connect it to the two real backend endpoints below — **without changing the visual design** unless a state (loading/empty/stale/error) has no existing markup for it.

## 1. Where to work

- Entry component (already wired, do not touch): `app-ai-advisor` in `libs/invento/features/ai-advisor/ai-advisor/` — it just renders `<app-ai-advisor-panel />`.
- **Real target:** `AiAdvisorPanel`, imported from `@invento/invento/features/ai-advisor/ai-advisor-panel/ai-advisor-panel`. Locate this component first and read it fully — its current template, inputs, and any mock data — before writing anything. Do not guess its shape.
- If the UI also has a brief **history/past-briefs view** (list, calendar filter, pagination) — locate it in the `ai-advisor` feature folder the same way. If no such UI exists yet, flag that rather than inventing one from scratch beyond minimal scaffolding.
- Locate the project's existing HTTP conventions before creating anything new: find an existing feature service that already calls this backend (base URL / environment config, auth token attachment — interceptor vs manual header, error handling pattern, RxJS vs Signals/`resource()` style). **Mirror that exact pattern.** Do not introduce a new HTTP calling convention if one already exists in the codebase.

---

## 2. Endpoint A — `GET /advisor/brief` (today's brief, dashboard panel)

```
GET /advisor/brief
Authorization: Bearer <token>   (required)
```

- Dashboard-only route. Roles: `OWNER` or `ADMIN`. A `USER` token gets **403**.
- **401** — missing/malformed/invalid Authorization header.
- **200 — always.** This endpoint never 404s. An empty state is a valid `200`, not an error.

### Response shape

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
  id: string; // used by PATCH /advisor/insights/{id} — see §4
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
  insights: Insight[];
}

export interface TodaysBriefResponse {
  brief: Brief | null; // null = store has never had a brief written
  isStale: boolean; // true = newest brief isn't today's
}
```

### Business rules — get these exactly right

1. **`brief: null` is a normal state, not an error.** Render "your first brief arrives tomorrow morning" (or equivalent existing empty-state markup), never an error banner.
2. **`isStale: true`** means the brief shown is not today's — date it (e.g. "from Tuesday", derived from `briefDate`), never present it as if it's fresh.
3. **Never derive numbers from `title`/`body`.** Those are prose. All figures, ids, and links come from `payload`.
4. **Money fields (`estimatedDailyLoss`, `tiedUpAmount`) are minor units.** `11371` → `113.71 EGP`. Divide by 100 and format with the currency already used elsewhere in the app.
5. **`insights` arrive pre-sorted by `position`.** Render in that order as-is. Do not re-sort by severity, kind, or `createdAt`.
6. **`narratorStatus: 'fallback'`** is not an error state and needs no banner/warning.
7. **`status: 'dismissed'`** insights stay visible in the list, just visually de-emphasized (e.g. greyed out). Don't filter them out of the array.
8. **Null-safe formatting per kind:**
   - `TrendingPayload.ratio === null` → render "with none sold before", never a dash or `0×`.
   - `SlowMoverPayload.daysSinceLastSale === null` → the product has never sold; phrase accordingly.
   - `variantLabel === null` on stockout/restock → simple product with no options; omit the variant line entirely.
9. A missing section (e.g. no weather insight) is expected, not a bug — just render whatever `insights` contains.
10. Respect the existing `ChangeDetectionStrategy.OnPush` — whatever state mechanism you introduce (signals, `resource()`/`rxResource()`, or `async` pipe over an observable) must trigger change detection correctly under OnPush. Match whatever reactive style the rest of the codebase already uses for HTTP-backed panels.

### States to handle

- **Loading**, **Empty** (`brief === null`), **Stale** (`isStale === true`), **Loaded** (headline + insights in `position` order, severity styling — only `stockout` is `critical`; `restock`/`demand_gap` are `warning`; the rest `info`), **401** (follow the app's existing 401 handling), **403** (route shouldn't be reachable for `USER`; handle gracefully if it is).

---

## 3. Endpoint B — `GET /advisor/briefs` (brief history / past briefs list)

```
GET /advisor/briefs?page=1&limit=20&from=2026-08-01&to=2026-08-31
Authorization: Bearer <token>   (required)
```

- Same auth rules as Endpoint A: `OWNER`/`ADMIN` only, **401** on bad/missing token, **403** for a `USER` token.
- **400** — a malformed date, or a query param the backend doesn't declare. `message` may be a single string or an array of strings (multiple validation failures at once) — surface it using the app's existing form/query-error pattern.
- `page` defaults to 1. `limit` defaults to 20, max 100.
- `from`/`to` are **inclusive bounds on `briefDate`**, matched against the **store's own local calendar day** — not a UTC instant. Send plain `YYYY-MM-DD` from any date picker; don't apply client-side timezone conversion.

### Response shape

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
  // deliberately NO `insights` here — see rule below
}

export interface ListBriefsResponse {
  items: BriefSummary[];
  total: number; // rows matching the filter, across every page
  page: number;
  limit: number;
  totalPages: number;
}
```

### Business rules

1. **Rows carry no `insights`.** This is a summary/history table only — headline, date, counts. Do not attempt to render insight detail from this response.
2. **Viewing a past brief's full insights requires fetching it individually by id.** That single-brief-by-id endpoint (e.g. `GET /advisor/briefs/{id}`) has **not been provided to you.** If the history UI needs row-click-to-detail, see §4 — do not guess this contract.
3. `narratorStatus: 'fallback'` — same rule as Endpoint A, no banner.
4. Standard pagination — build the pager against `total`/`page`/`limit`/`totalPages`, respecting the max `limit` of 100.
5. Results are newest-first — don't re-sort.

### States to handle

- **Loading**, **Empty** (`items: []` — e.g. "no briefs yet" or "no briefs in this range" if `from`/`to` were applied), **Loaded** (table/list + pager + date filter), **400** (surface the validation message near the filter controls), **401/403** (same as Endpoint A).

---

## 4. Endpoints referenced but not fully specified — verify before building, don't guess silently

1. **`PATCH /advisor/insights/{id}`** — implied by the `insights[].id` field's description ("what `PATCH /advisor/insights/{id}` takes"), for marking an insight `acted` or `dismissed`. If the panel has (or needs) dismiss/mark-as-acted buttons:
   - First search the codebase/API docs for the real contract.
   - If genuinely not discoverable, implement conservatively against this best guess and flag it in a code comment for review:
     ```typescript
     // PATCH /advisor/insights/{id}
     // ASSUMED contract — verify against backend before shipping.
     interface UpdateInsightStatusRequest {
       status: 'acted' | 'dismissed';
     }
     ```
2. **A single-brief-by-id endpoint** (likely `GET /advisor/briefs/{id}`), needed only if the history view (Endpoint B) supports clicking a row to see that day's full insights. Its shape is probably identical to `Brief` from Endpoint A (minus the `isStale` wrapper), but **this is a guess** — confirm before wiring row-click-to-detail. If it can't be confirmed, ship the history list without detail view and flag the gap rather than fabricating the call.

In both cases: **do not build against assumptions silently — surface them to me.**

## 5. Acceptance checklist (verify before considering this done)

- [ ] `AiAdvisorPanel` calls the real `GET /advisor/brief` endpoint through a service that matches the project's existing HTTP/auth conventions.
- [ ] The history/past-briefs UI (if present) calls `GET /advisor/briefs` with pagination and `from`/`to` date filtering wired to real controls.
- [ ] All response types match the interfaces in §2 and §3 exactly, including the 7 discriminated `payload` shapes.
- [ ] Empty, stale, loading, and loaded states all render distinct, correct UI for both endpoints.
- [ ] Insights render in `position` order, unmodified; brief history renders newest-first, unmodified.
- [ ] Money values are converted from minor units before display.
- [ ] `ratio: null` and `daysSinceLastSale: null` are handled with the specific copy in §2, not raw `null`/dashes.
- [ ] `dismissed` insights remain visible (de-emphasized), not filtered out.
- [ ] `narratorStatus: 'fallback'` shows no error/warning UI, in either endpoint.
- [ ] 400 (history only), 401, and 403 are handled using the app's existing patterns, not new one-off logic.
- [ ] `from`/`to` filters are sent as plain calendar dates, no client-side timezone shifting.
- [ ] OnPush change detection still works correctly for all new reactive state.
- [ ] Any assumption made about the two undocumented endpoints in §4 is explicitly flagged, not silently shipped.
