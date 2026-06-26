# AGENTS.md

## Project

Vue 3 CDN-based SPA. No build tools, no SFCs, ES modules only, static deployment.

## Loading

`index.html` loads Vue/Router/Axios via CDN `<script>` tags, then fetches `app-version.json` to set `window.APP_VERSION` for cache busting, then loads `/src/js/main.js` as a module.

An alias `window.lazyLoad` is available (`() => import(\`${page}.js?v=${v}\`)`), but routes use inline `import()` with `?v=` directly.

## Architecture

```
App.js  →  ThemeProvider  →  SidebarProvider  →  RouterView
                 ↓
          AdminLayout (shared shell: AppSidebar + AppHeader + slot)
```

All pages are lazy-loaded via dynamic `import()` with `?v=${v}` cache busting.

## Routing (`src/js/router/index.js`)

- Uses `createWebHistory()`
- Protected routes use `meta: { requiresAuth: true }`
- Auth check in `beforeEach` via `auth.isAuthenticated()`
- Title set as `document.title = to.meta.title`

Key routes:

| Path | Component |
|------|-----------|
| `/login` | Auth/Login.js |
| `/` (auth) | Ecommerce.js (dashboard) |
| `/profile` | Profile.js |
| `/products` | Products.js |
| `/add-product?type={type_code}` | Add_Product.js |
| `/product/:product_uuid` | Edit_Product.js |

## Auth

- Token stored in `localStorage.auth_token`
- Axios interceptor in `src/js/utils/axios.js` attaches `Authorization: Bearer {token}` header
- `auth.js` (plain object) provides `login()`, `logout()`, `isAuthenticated()`, `getToken()`

## API Calls

Use `webService` (`src/js/utils/webService.js`) for all HTTP. Never call Axios or Fetch directly.

```js
const response = await webService.post('/api/platform/add-product', payload)
```

Response validation: `response.data.code === 200` for success, `600` for validation errors.

Error handling: every call wrapped in try/catch with `console.error(error)`.

BASE_URL is configured in `src/js/config/env.js` (default `http://api.platform.local`).

## Toast

Global utility: `window.toast({ type: 'success'|'error'|'warning'|'info', message, duration })`.

## Styling

Tailwind CSS + `app.css` with CSS custom properties (`--accent`, `--radius`, `--sidebar-w`, etc.) and ap2-* utility classes for the product builder.

## Product Module

### Files

```
views/Products.js               — product list (CRUD, drag-and-drop reorder)
views/Add_Product.js             — wraps ProductFormContainer in add mode
views/Edit_Product.js            — fetches product from API, wraps ProductFormContainer
components/ProductFormContainer.js — shared form controller (state, validation, submission)
components/product/              — presentational tab components + preview
composables/useProductForm.js    — defaults, normalization, payload building
```

### Endpoints

| Action | Endpoint | Method |
|--------|----------|--------|
| List | `/api/platform/get-product-list` | GET |
| Get single | `/api/platform/product/{product_uuid}` | GET |
| Create | `/api/platform/add-product` | POST |
| Update | `/api/platform/update-product` | POST |
| Delete | `/update-status` (with `action: delete`) | POST |
| Sort | `/api/platform/sort-products` | POST |

`Products.js` is an API-backed catalog with drag-and-drop (SortableJS loaded dynamically from CDN), publish/draft toggle, and delete.

### Product Types

```
digital_download, lead_magnet, external_link, custom_service
```

### Add Mode (Add_Product.js → ProductFormContainer)

- Type comes from `?type=` query param
- Only Thumbnail tab is initially accessible
- Checkout + Options unlock only after the first successful API save (sets `firstStepSaved = true`)
- On success, `product_uuid` returned by API is stored as `draftProductUuid`; subsequent saves hit the update endpoint
- Restoring a local draft does NOT unlock tabs — must re-save through API first

### Edit Mode (Edit_Product.js → ProductFormContainer)

- Reads `product_uuid` from route param
- Fetches via `webService.get('/api/platform/product/${uuid}')`
- Normalizes response with `normalizeProductPayload()` from `useProductForm.js`
- All tabs immediately available

### Payload Structure

Payload built in `ProductFormContainer.buildPayload()`.

Parent fields: `save_mode`, `product_uuid` (update only), `type_code`, `title`, `slug`, `short_description`, `description`, `cta_text`, `price`, `compare_at_price`, `is_free`, `is_featured`, `card_badge_enabled`, `badge_text`, `badge_color`.

Badge fields (`card_badge_enabled`, `badge_text`, `badge_color`) belong **only** at the parent level — do not duplicate in `builder_config` as `card_badge_enabled`, `card_badge_text`, `card_badge_color`.

`builder_config` contains: `ui_type`, `card_style`, `preview_emoji`, `preview_background`, `card_button_color`, `headline`, `file_delivery_type`, `file_url`, `file_label`, `external_url`, `external_label`, `publish_immediately`, `scheduled_publish_at`, `social_proof`, `marketing_automation`, `confirmation_email`, `seo`, `type_settings`, `collect_fields`.

### Normalization

Always normalize through `normalizeProductPayload()`. The get-product response stores data across:
- Response root (main fields)
- `type_record` (type-specific values)
- `marketing` (shared marketing values)

The normalizer handles numeric/string booleans, JSON collect_fields, legacy badge colors, scheduled dates, and type-specific mapping.

### Draft Storage

Local drafts use `localStorage` key `creator_add_product_draft`. Draft data is normalized before hydration.

### `add-product.html`

This standalone HTML file is **not** the SPA source of truth. Do not copy logic from it.

## Gotchas

- No `ProductService` layer exists — components import `webService` directly
- Glob import path: `import('/src/js/views/Ecommerce.js?v=' + APP_VERSION)` — always preserve `?v=`
- `collect_fields` may arrive as a JSON string from the API — must be parsed safely
- `Products.js` now has full CRUD: it loads from API, allows reorder/drag-drop, status toggle, and delete
- `auth.js` has an apparent bug: `USER_DATA_KEY` is referenced but never defined (used in `getUser()` / `updateUser()`)
