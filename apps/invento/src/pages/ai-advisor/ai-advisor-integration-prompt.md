# Task: Wire the AI Advisor dashboard panel to the real backend

You are working inside the **Invento** Angular monorepo (standalone components, OnPush change detection, Tailwind). A UI shell for the "AI Advisor" dashboard feature already exists but is currently unwired (mock/static data or empty). Your job is to connect it to the real backend endpoint below — **without changing the visual design** unless a state (loading/empty/stale/error) has no existing markup for it.

## 1. Where to work

- Entry component (already wired, do not touch): `app-ai-advisor` in `libs/invento/features/ai-advisor/ai-advisor/` — it just renders `<app-ai-advisor-panel />`.
- **Real target:** `AiAdvisorPanel`, imported from `@invento/invento/features/ai-advisor/ai-advisor-panel/ai-advisor-panel`. Locate this component first and read it fully — its current template, inputs, and any mock data — before writing anything. Do not guess its shape.
- Locate the project's existing HTTP conventions before creating anything new: find an existing feature service that already calls this backend (base URL / environment config, auth token attachment — interceptor vs manual header, error handling pattern, RxJS vs Signals/`resource()` style). **Mirror that exact pattern.** Do not introduce a new HTTP calling convention if one already exists in the codebase.

## 2. The endpoint

```
GET /advisor/brief
Authorization: Bearer <token>   (required)
```

- Dashboard-only route. Roles: `OWNER` or `ADMIN`. A `USER` token gets **403** — there is no storefront/shopper equivalent of this endpoint.
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
  id: string; // used by PATCH /advisor/insights/{id} — see §5
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

## 3. Non-negotiable business rules — get these exactly right

1. **`brief: null` is a normal state, not an error.** Render "your first brief arrives tomorrow morning" (or equivalent existing empty-state markup), never an error banner.
2. **`isStale: true`** means the brief shown is not today's — date it (e.g. "from Tuesday", derived from `briefDate`), never present it as if it's fresh.
3. **Never derive numbers from `title`/`body`.** Those are prose (often Gemini-written, rewritten every generation). All figures, ids, and links come from `payload`. The prose is for display text only.
4. **Money fields (`estimatedDailyLoss`, `tiedUpAmount`) are minor units.** `11371` → `113.71 EGP`. Divide by 100 and format with the currency already used elsewhere in the app.
5. **`insights` arrive pre-sorted by `position`.** Render in that order as-is. Do not re-sort by severity, kind, or `createdAt` — all insights in a brief share the same `createdAt`, so sorting by it is meaningless.
6. **`narratorStatus: 'fallback'`** is not an error state and needs no banner/warning — the numbers are correct, only the phrasing is plainer template text.
7. **`status: 'dismissed'`** insights stay visible in the list, just visually de-emphasized (e.g. greyed out). Do not filter them out of the array — hiding them causes them to reappear on refresh.
8. **Null-safe formatting per kind:**
   - `TrendingPayload.ratio === null` → render "with none sold before", never a dash or `0×`.
   - `SlowMoverPayload.daysSinceLastSale === null` → the product has never sold; phrase accordingly, don't render "null days".
   - `variantLabel === null` on stockout/restock → it's a simple product with no options; omit the variant line entirely rather than showing "null".
9. **A missing section is expected**, not a bug — if weather or calendar insights don't appear, that signal simply had nothing to report or failed independently server-side. There's no "section failed" flag to handle; just render whatever `insights` contains.
10. Respect the existing `ChangeDetectionStrategy.OnPush` on `AiAdvisor`/`AiAdvisorPanel` — whatever state mechanism you introduce (signals, `resource()`/`rxResource()`, or an `async` pipe over an observable) must trigger change detection correctly under OnPush. Match whatever reactive style the rest of the codebase already uses for HTTP-backed panels; don't mix signals and manual subscriptions.

## 4. States the panel needs to handle

- **Loading** — skeleton/spinner consistent with the app's existing loading patterns.
- **Empty** (`brief === null`) — "first brief arrives tomorrow morning" messaging.
- **Stale** (`isStale === true`) — dated framing per rule #2 above.
- **Loaded** — headline, insights list in `position` order, severity-based styling (`critical` > `warning` > `info` — only `stockout` is `critical`; `restock` and `demand_gap` are `warning`; the rest are `info`).
- **401** — token invalid/expired; follow whatever the app already does elsewhere on 401 (likely redirect to login / trigger the auth interceptor's existing handling — don't build a new one).
- **403** — user isn't OWNER/ADMIN; this route simply shouldn't be reachable for a `USER` role, but handle gracefully if it is (e.g. hide the panel or show a permissions message consistent with how the rest of the dashboard handles 403s).

## 5. Secondary endpoint referenced but not fully specified — verify before building

The `insights[].id` field's description says it's "what `PATCH /advisor/insights/{id}` takes" — implying an endpoint exists for marking an insight `acted` or `dismissed`. **Its full request/response contract was not provided.** If the panel UI already has (or needs) dismiss/mark-as-acted buttons:

1. First search the codebase/API docs for the actual `PATCH /advisor/insights/{id}` contract — do not invent one if it's discoverable.
2. If it genuinely can't be found, implement conservatively against this best-guess contract and flag it clearly in a code comment for review:
   ```typescript
   // PATCH /advisor/insights/{id}
   // ASSUMED contract — verify against backend before shipping.
   interface UpdateInsightStatusRequest {
     status: 'acted' | 'dismissed';
   }
   ```
3. Do not build this against assumptions silently — surface the assumption to me.

## 6. Acceptance checklist (verify before considering this done)

- [ ] `AiAdvisorPanel` calls the real `GET /advisor/brief` endpoint through a service that matches the project's existing HTTP/auth conventions (no new pattern introduced).
- [ ] All response types match the interfaces in §2 exactly, including the 7 discriminated `payload` shapes.
- [ ] Empty (`brief: null`), stale, loading, and loaded states all render distinct, correct UI.
- [ ] Insights render in `position` order, unmodified.
- [ ] Money values are converted from minor units before display.
- [ ] `ratio: null` and `daysSinceLastSale: null` are handled with the specific copy in §3, not raw `null`/dashes.
- [ ] `dismissed` insights remain visible (de-emphasized), not filtered out.
- [ ] `narratorStatus: 'fallback'` shows no error/warning UI.
- [ ] 401 and 403 are handled using the app's existing patterns, not new one-off logic.
- [ ] OnPush change detection still works correctly for all new reactive state.
- [ ] Any assumption made about the undocumented PATCH endpoint (§5) is explicitly flagged, not silently shipped.
