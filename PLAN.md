# Nx Multi-App Monorepo Migration

**Branch:** `feat/nx-multi-app-workspace`
**Status:** ✅ COMPLETED

---

## Phase 1 — Setup ✅

1. ✅ Created branch `feat/nx-multi-app-workspace`
2. ✅ Installed `@nx/angular@23.1.0` (via `--legacy-peer-deps` for Angular 22 compat)

## Phase 2 — Initialize Nx Workspace ✅

3. ✅ Ran `npx nx@latest init`
   - Created `nx.json` with target defaults, caching, named inputs
   - Converted `angular.json` → `project.json` for project `site-builder`

## Phase 3 — Move Source into `apps/site-builder/` ✅

4. ✅ Created directory structure with feature subfolders:

   ```
   apps/site-builder/src/app/features/
   ├── builder/        (service/ components/ types/ directives/ utils/)
   ├── brainstorm/     (service/ components/ types/ directives/ utils/)
   ├── ai-interview/   (service/ components/ types/ directives/ utils/)
   ├── preview/        (service/ components/ types/ directives/ utils/)
   ├── validation/     (service/ components/ types/ directives/ utils/)
   └── home/           (service/ components/ types/ directives/ utils/)
   ```

5. ✅ Moved `src/` → `apps/site-builder/src/`, `public/` → `apps/site-builder/public/`, `proxy.conf.json` → `apps/site-builder/`
6. ✅ Created `apps/site-builder/tsconfig.app.json` and `tsconfig.spec.json`
7. ✅ Updated `project.json` with new paths (`sourceRoot`, `browser`, `server`, `tsConfig`, `outputPath`, `assets`, `proxyConfig`, `lintFilePatterns`)
8. ✅ Updated root `tsconfig.json` paths (`@/*` → `./apps/site-builder/src/*`)
9. ✅ Updated `eslint.config.ts` patterns

## Phase 4 — Scaffold New Apps ✅

10. ✅ `nx g @nx/angular:app apps/userSite` (standalone, SSR, routing, CSS)
11. ✅ `nx g @nx/angular:app apps/invento` (standalone, SSR, routing, CSS)
12. ✅ Created feature scaffolding:

    ```
    apps/userSite/src/app/features/
    ├── product/     (service/ components/ types/ directives/ utils/)
    ├── cart/        (service/ components/ types/ directives/ utils/)
    └── checkout/    (service/ components/ types/ directives/ utils/)

    apps/invento/src/app/features/
    ├── analytics/   (service/ components/ types/ directives/ utils/)
    ├── ai-tools/    (service/ components/ types/ directives/ utils/)
    └── admin/       (service/ components/ types/ directives/ utils/)
    ```

## Phase 5 — Extract Shared Libraries ✅

13. ✅ `nx g @nx/angular:lib libs/core` — interfaces, services, utils from `src/app/core/`
    - Barrel export via `libs/core/src/index.ts`
14. ✅ `nx g @nx/angular:lib libs/shared` — components, directives, constants, mocks from `src/app/{shared,components}/`
    - Barrel export via `libs/shared/src/index.ts`
15. ✅ `libs/ui/` (Spartan UI) kept as-is, consumed via tsconfig paths

## Phase 6 — Configure Nx & Shared Tooling ✅

16. ✅ Updated `nx.json` with @angular/build target defaults
17. ✅ Updated root `package.json` scripts:
    - `start` → `nx serve site-builder`
    - `build` → `nx build site-builder`
    - `start:user` → `nx serve userSite`
    - `start:invento` → `nx serve invento`
    - `test` → `nx test site-builder`
    - `lint` → `nx run-many -t lint`
18. ✅ Created `tsconfig.base.json` with path aliases for all apps and libs
19. ✅ Updated `eslint.config.ts` to cover all `apps/**` and `libs/**`
20. ✅ Added `tsConfig` to test target in project.json
21. ✅ Fixed Express route patterns in new apps (`/**` → pathless `app.use()`)

## Phase 7 — Verification ✅

22. ✅ `nx build site-builder` — builds with SSR, 5 prerendered routes
23. ✅ `nx build userSite` — builds with SSR
24. ✅ `nx build invento` — builds with SSR
25. ✅ `nx test site-builder` — 17 tests pass (2 suites)
26. ✅ `nx run-many -t lint` — all files pass linting
27. ✅ `nx run-many -t build` — all 3 apps build in parallel

## Final Structure

```
invento-ai/
├── apps/
│   ├── site-builder/   ← generates styles/colors/content
│   │   └── src/app/features/
│   │       ├── builder/    (service/ components/ types/ directives/ utils/)
│   │       ├── brainstorm/ (service/ components/ types/ directives/ utils/)
│   │       ├── ai-interview/ (service/ components/ types/ directives/ utils/)
│   │       ├── preview/    (service/ components/ types/ directives/ utils/)
│   │       ├── validation/ (service/ components/ types/ directives/ utils/)
│   │       └── home/       (service/ components/ types/ directives/ utils/)
│   ├── userSite/       ← renders generated storefront
│   │   └── src/app/features/
│   │       ├── product/  (service/ components/ types/ directives/ utils/)
│   │       ├── cart/     (service/ components/ types/ directives/ utils/)
│   │       └── checkout/ (service/ components/ types/ directives/ utils/)
│   └── invento/         ← admin dashboard with AI features
│       └── src/app/features/
│           ├── analytics/ (service/ components/ types/ directives/ utils/)
│           ├── ai-tools/  (service/ components/ types/ directives/ utils/)
│           └── admin/     (service/ components/ types/ directives/ utils/)
├── libs/
│   ├── ui/              ← Spartan UI components (button, card, badge, etc.)
│   ├── core/            ← interfaces, services, utils (@invento/core)
│   └── shared/          ← directives, constants, mocks, reusable components (@invento/shared)
├── project.json         ← site-builder project config
├── nx.json              ← Nx workspace config
├── tsconfig.base.json   ← shared base TS config with path aliases
├── tsconfig.json        ← root TS config (extends base)
├── eslint.config.ts
├── package.json
└── .prettierrc
```

## App Communication Pattern

| App            | Role                                   | Output                                  |
| -------------- | -------------------------------------- | --------------------------------------- |
| `site-builder` | Generates theme, brand config, content | Produces brand data → stored via API    |
| `userSite`     | Renders the generated storefront       | Consumes brand data from API            |
| `invento`      | Admin dashboard, AI tools, analytics   | Manages both apps, provides AI features |
