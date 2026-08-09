Build a full **Categories management page** for an admin dashboard in **Angular 22** (standalone components, signals, new control flow `@if`/`@for`) using **Spartan UI** (`@spartan-ng/ui-*` primitives, built on Radix + Tailwind). Follow the existing project conventions (folder structure, naming, HttpClient setup, environment files) — inspect the codebase first and match its style.

### 0. Project structure

This is an Nx-style monorepo. The app lives at `apps/invento/src/app/`, structured as:

```
apps/invento/src/app/
├── core/          # singleton services, interceptors, guards, base config
├── entities/       # domain models/types shared across features (e.g. Category interface likely belongs here)
├── features/       # reusable feature logic/components consumed by pages
├── layouts/        # shell/layout components (sidebar, admin layout, etc.)
├── pages/          # routed page components, one folder per route
│   ├── accSetting/
│   ├── ai-advisor/
│   ├── analytics/
│   ├── categories/   ← placeholder folder, implement everything here
│   ├── home/
│   ├── not-found/
│   ├── orders/
│   ├── products/
│   ├── suppliers/
│   └── users/
└── shared/         # shared/dumb UI components, pipes, directives, utils
```

Before generating anything, **inspect `core/`, `entities/`, `features/`, and `shared/`** (and how existing pages like `products/`, `orders/`, or `suppliers/` are structured) to learn the established conventions for:

- where services/HTTP calls live (likely `core/` for the base API client/HttpClient config, `entities/` or `features/categories/` for the categories-specific service)
- where models/interfaces are declared (likely `entities/`)
- how routing is wired for `pages/*` (check for a `pages.routes.ts` or similar, and how `categories` is currently registered, even as a placeholder)
- what layout wraps pages (`layouts/`) so the new page renders inside the correct shell
- any existing shared table, pagination, dialog, toast, or file-upload wrapper components in `shared/` that should be reused instead of rebuilding from scratch
- the general naming/file-organization pattern used across `pages/*` folders (e.g. how a page folder splits into sub-components), even if none of the existing pages are backend-integrated yet

Note: `products/` and the other existing pages are **not yet integrated with the backend** — they may only have static/mock UI so far. Don't assume they contain a working HTTP integration pattern to copy; only borrow their structural/naming conventions and any genuinely reusable shared UI (tables, dialogs, etc.). The service layer, signal store, and backend wiring for `categories` will likely be the first real backend integration in `pages/`, so build it cleanly and in a way that could reasonably become the template other pages follow later.

Place the new code as follows unless the codebase clearly dictates otherwise:

- `entities/category/category.model.ts` — types/interfaces
- `entities/category/category.service.ts` (or `core/` if that's where other domain services sit) — HTTP calls
- `features/categories/` — the signal store/facade and any non-trivial reusable pieces (form, image uploader, reorder logic) if `features/` is where this project puts feature-level building blocks
- `pages/categories/` — the routed page component(s) that compose everything above into the actual screen(s)

### 1. Backend contract

Base path: `/categories`. All endpoints require `Authorization: Bearer <token>` (already handled by an existing HTTP interceptor — do not add auth headers manually, just call the API).

**Category entity**

```ts
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  position: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Endpoints**
| Action | Method | URL | Body | Response |
|---|---|---|---|---|
| List | GET | `/categories/?page=&limit=&search=&isPublished=&isFeatured=` | — | `{ items: Category[], total, page, limit, totalPages }` |
| Get one | GET | `/categories/{id}` | — | `Category` |
| Create | POST | `/categories/` | `{ name (required), slug?, description?, isPublished?, isFeatured? }` | `Category` |
| Update | PATCH | `/categories/{id}` | any subset of `{ name, slug, description, isPublished, isFeatured }` | `Category` |
| Delete | DELETE | `/categories/{id}` | — | `{ message: string }` (404 → `{ message, error, statusCode }`) |
| Reorder | PATCH | `/categories/reorder` | `{ items: { id: string, position: number }[] }` | `Category[]` |
| Upload image | PUT | `/categories/{id}/image` | `multipart/form-data` field `image` (binary) | `Category` (with `imageUrl` set) |
| Delete image | DELETE | `/categories/{id}/image` | `multipart/form-data` (empty) | `Category` (with `imageUrl: null`) |

### 2. Service layer

Generate `CategoriesService` (injectable, `providedIn: 'root'`) with typed methods for every endpoint above, using `HttpClient`. Return `Observable<T>`. Build query params for the list endpoint conditionally (omit empty/undefined filters). Put the `Category`, list response, and reorder-payload interfaces in a `categories.model.ts` (or match wherever the project already keeps models/types).

### 3. State management

Use a signal-based store/facade (a simple injectable class with signals is fine — no NgRx unless the project already uses it):

- `categories = signal<Category[]>([])`
- `total`, `page`, `limit`, `totalPages` signals
- `loading = signal(false)`, `error = signal<string | null>(null)`
- `filters = signal({ search: '', isPublished: undefined, isFeatured: undefined })`
- Methods: `loadCategories()`, `createCategory()`, `updateCategory()`, `deleteCategory()`, `reorderCategories()`, `uploadImage()`, `deleteImage()`, each updating the signals and handling errors, and refreshing the list (or patching local state optimistically) after mutations.

### 4. Screens / components

Route: `/admin/categories` (lazy-loaded standalone route).

**a) Category List Page** (`categories-list.component.ts`)

- Header with page title, "Add Category" button (opens create dialog/sheet).
- Toolbar: search input (debounced, ~300ms), `isPublished` and `isFeatured` filter selects (All/Published/Unpublished, All/Featured/Not Featured) using Spartan `hlm-select`.
- Table using Spartan `hlm-table` with columns: drag handle, thumbnail (`imageUrl` or placeholder), Name, Slug, Description (truncated), Published (badge), Featured (badge), Position, Actions (edit / delete / manage image icons via `hlm-menu` dropdown).
- Drag-and-drop reordering via Angular CDK `DragDropModule` (`cdkDropList` / `cdkDrag`) on the table rows. On drop, recompute `position` for all affected rows and call the reorder endpoint; show optimistic UI update, roll back on failure.
- Pagination controls (page/limit) using Spartan pagination component or a simple custom one, wired to `page`/`limit`/`totalPages` signals.
- Loading state: skeleton rows (Spartan `hlm-skeleton`) while `loading()` is true.
- Empty state: friendly message + "Add Category" CTA when `items.length === 0`.
- Error state: inline alert (Spartan `hlm-alert`) with retry button.

**b) Create / Edit Category Dialog** (`category-form-dialog.component.ts`)

- Spartan `hlm-dialog` (or `brn-dialog`) containing a Reactive Form.
- Fields: `name` (required, text input, `hlm-input`), `slug` (text input, optional — auto-slugify from `name` if left untouched, but allow manual override), `description` (textarea), `isPublished` (toggle/switch), `isFeatured` (toggle/switch).
- Same component handles both create and edit modes (pass an optional `category: Category | null` input; prefill form in edit mode).
- Validation messages under each field using Spartan form-field error slots.
- Submit button shows loading spinner while request is in flight; disable form during submit.
- On success: close dialog, show success toast, refresh list. On error: show error toast/inline message, keep dialog open.

**c) Delete Confirmation**

- Spartan `hlm-alert-dialog` ("Are you sure you want to delete '<name>'? This cannot be undone.") before calling DELETE. Handle 404 gracefully (item likely already deleted — remove from local list, show info toast).

**d) Image Management**

- Inside the edit dialog (or a small popover/menu action on the row): file input (accept `image/*`) with drag-and-drop drop zone, preview of current `imageUrl` or placeholder, "Upload"/"Replace" and "Remove" buttons.
- Upload sends `FormData` with field name `image` via PUT; show upload progress if easy to wire with `HttpClient` `reportProgress`.
- Remove calls the delete-image endpoint and clears the preview.
- Update the row/dialog state with the returned `Category` (new `imageUrl`) on success.

### 5. Cross-cutting concerns

- Use Spartan's toast/notification primitive (or the project's existing notification service) for all success/error feedback.
- Centralize HTTP error handling: extract `message` from API error responses and show a readable toast; log unexpected errors to console.
- All new components: standalone, `ChangeDetectionStrategy.OnPush`, signals for local state, typed reactive forms (`FormGroup<...>`).
- Use Tailwind utility classes consistent with Spartan's style (no ad-hoc CSS unless necessary).
- Ensure keyboard accessibility and ARIA labels on icon-only buttons (edit/delete/drag handle).
- Add basic unit tests (Jasmine/Karma or whatever the project uses) for the service methods (mock `HttpClient`) and for the store's core logic.

### 6. Deliverables

Generate, placed according to the project structure inspected in step 0 (adjust exact folder names to match whatever convention `products/` or `orders/` already sets):

1. `category.model.ts` — interfaces/types (in `entities/`).
2. `category.service.ts` — HTTP calls (in `entities/` or `core/`, matching sibling domains).
3. Signal-based store/facade for categories state (in `features/categories/` if that's the pattern, otherwise co-located with the page).
4. List screen component(s) — table, filters, pagination, drag-reorder (in `pages/categories/`).
5. Create/edit form dialog component.
6. Delete confirmation (dialog component or inline alert-dialog usage).
7. Image upload/remove widget component.
8. Route definition wiring the `categories` page into whatever routing file already registers `pages/*` routes (lazy-loaded, consistent with how `products`/`orders` are registered), rendered inside the existing admin `layouts/` shell.

Ask me clarifying questions only if something about routing conventions, the existing HTTP base URL setup, or the toast/notification service is genuinely ambiguous from the codebase — otherwise make reasonable assumptions consistent with the rest of the project's structural conventions and proceed. Since `categories` will likely be the first page with real backend integration, favor clean, conventional Angular/HttpClient patterns over guessing at backend-integration conventions that don't exist yet in the codebase.
