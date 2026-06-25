# AGENTS.md

## Project

Vue 3 CDN-based SPA.

* No Vite
* No Webpack
* No npm build process
* No Single File Components (*.vue)
* ES Modules only
* Static deployment

## Tech Stack

* Vue 3 (CDN)
* Vue Router 4 (CDN)
* Axios
* Tailwind CSS
* Laravel/Lumen APIs

## Architecture

index.html
→ main.js
→ App.js
→ Router
→ Lazy Loaded Pages

All pages are loaded using dynamic imports:

```js
() => import('/src/js/views/Profile.js?v=' + APP_VERSION)
```

Always preserve cache busting.

## Rules

### Components

* One component per file
* Export default component
* Prefer Composition API
* Keep business logic outside templates

### Routing

* All routes belong in router/index.js
* Use lazy loading for pages
* Use meta.title for page titles
* Use meta.requiresAuth for protected routes

Example:

```js
{
    path: '/products',
    component: () => import('/src/js/views/Products.js?v=' + APP_VERSION)
}
```

### API Calls

Never call axios directly from pages.

Use services:

```js
ProductService.list()
ProductService.create(payload)
ProductService.update(id, payload)
```

Folder:

```text
src/js/services/
```


### Imports

Prefer:

```js
import Component from '../components/Component.js'
```

Avoid hardcoded absolute paths unless already used by router.
## API Client Standard

Use `webService` for all HTTP requests.

### Do

```javascript
const response = await webService.post('/api/platform/save-social-links', {
    data
});
```

```javascript
const response = await webService.get('/api/products');
```

```javascript
const response = await webService.put(`/api/products/${id}`, payload);
```

```javascript
const response = await webService.delete(`/api/products/${id}`);
```

### Don't

```javascript
axios.post(...)
```

```javascript
fetch(...)
```

Never call Axios or Fetch directly inside components.

### Response Validation

```javascript
if (response.data.code === 200) {
    // success
}
```

### Error Handling

All `webService` requests must be wrapped in:

```javascript
try {
    const response = await webService.post(url, payload);
} catch (error) {
    console.error(error);
}
```

### Benefits

* Centralized authentication
* Centralized headers
* Common error handling
* Request/response interceptors
* Consistent API behavior across the application

### Styling

* Tailwind only
* No inline styles
* Mobile responsive
* Reuse utility classes

### Error Handling

Every API call must:

```js
try {
   ...
} catch(error) {
   console.error(error)
}
```

Handle:

* 401
* 403
* 422
* 500


### Performance

* Lazy load pages
* Use computed over methods when possible
* Avoid unnecessary watchers
* Keep CDN dependencies minimal

## Product Module

### Product Module Files

```text
src/js/views/Products.js
src/js/views/Add_Product.js
src/js/views/Edit_Product.js
src/js/components/ProductFormContainer.js
src/js/components/product/ProductThumbnailTab.js
src/js/components/product/ProductCheckoutTab.js
src/js/components/product/ProductOptionsTab.js
src/js/components/product/ProductStorePreview.js
src/js/composables/useProductForm.js
```

`ProductFormContainer.js` is the shared form controller for both add and edit.
Do not duplicate form state, validation, payload building, tab behavior, or submission logic in `Add_Product.js` or `Edit_Product.js`.

`useProductForm.js` owns:

* Default form state
* Supported product types
* Product response normalization
* Legacy response compatibility
* Badge color normalization
* Shared payload helpers

The three product tab components should remain presentational. They receive the shared form and emit events to `ProductFormContainer.js`.

### Routes

```text
/products
/add-product?type={type_code}
/product/:product_uuid
```

All product routes are defined in `src/js/router/index.js` and must remain lazy-loaded with cache busting.

### Product List Behavior

`src/js/views/Products.js` currently displays the available product types and links to the add-product route.
It is a creation type chooser, not an API-backed product catalog table.

Supported types:

```text
digital_download
lead_magnet
external_link
custom_service
```

Each type link must preserve:

```js
/add-product?type={type_code}
```

### Add Product Behavior

`Add_Product.js` only configures and renders `ProductFormContainer`.

In add mode:

1. The selected type comes from the `type` query parameter.
2. Thumbnail is the only initially accessible tab.
3. Checkout and Options remain disabled until the Thumbnail form is successfully saved through the API.
4. A successful first save returns a `product_uuid`, stores it in `draftProductUuid`, unlocks all tabs, opens Checkout, and smoothly scrolls the form to the top.
5. Later draft saves use the update endpoint because the product now has a UUID.
6. Restoring a local draft does not unlock later tabs. Thumbnail must save successfully in the current add-form session.

Do not unlock later tabs from typing or localStorage alone. The first API save must succeed.

### Edit Product Behavior

`Edit_Product.js`:

1. Reads `product_uuid` from the route.
2. Calls:

```js
webService.get(`/api/platform/product/${uuid}`)
```

3. Normalizes the response with `normalizeProductPayload()`.
4. Passes the normalized payload to `ProductFormContainer` with `isEditMode`.

All tabs are immediately available in edit mode.

The shared form submits an existing product to:

```text
POST /api/platform/update-product
```

The update payload must include `product_uuid`.

### Add and Update API Endpoints

```text
POST /api/platform/add-product
POST /api/platform/update-product
GET  /api/platform/product/{product_uuid}
```

Use `webService` and validate:

```js
if (response.data.code === 200) {
    // success
}
```

Do not call Axios or Fetch directly.

### Product Payload Structure

The shared payload is built in `ProductFormContainer.buildPayload()`.

Core parent fields include:

```js
{
    save_mode,
    product_uuid, // update only
    type_code,
    title,
    slug,
    short_description,
    description,
    cta_text,
    price,
    compare_at_price,
    is_free,
    is_featured,
    card_badge_enabled,
    badge_text,
    badge_color,
    builder_config
}
```

Badge fields belong only at the parent level:

```js
card_badge_enabled
badge_text
badge_color
```

Do not add these obsolete duplicate keys to `builder_config`:

```js
card_badge_enabled
card_badge_text
card_badge_color
```

`builder_config` contains:

```js
{
    ui_type,
    card_style,
    preview_emoji,
    preview_background,
    card_button_color,
    headline,
    file_delivery_type,
    file_url,
    file_label,
    external_url,
    external_label,
    publish_immediately,
    scheduled_publish_at,
    social_proof,
    marketing_automation,
    confirmation_email,
    seo,
    type_settings,
    collect_fields
}
```

### Product Response Hydration

Always normalize API and draft payloads through:

```js
normalizeProductPayload(payload)
```

The get-product response stores data in three places:

* Main product fields at the response root
* Type-specific values in `type_record`
* Shared marketing values in `marketing`

The normalizer handles numeric and string booleans, JSON `collect_fields`, legacy builder-config values, badge colors, scheduled date formatting, and type-specific records.

Do not map the get-product response independently in multiple components.

### Type-Specific Mapping

#### Digital Download

`type_record` maps:

```text
file_delivery_type → form.fileDeliveryType
file_url           → form.fileUrl
file_name          → form.fileName
```

Save through:

```text
builder_config.file_delivery_type
builder_config.file_url
builder_config.file_label
```

#### Lead Magnet

`type_record` maps:

```text
cta_label       → form.leadMagnetCtaLabel
success_message → form.leadMagnetSuccessMessage
redirect_url    → form.leadMagnetRedirectUrl
```

Save under `builder_config.type_settings`.

#### External Link

`type_record` maps:

```text
destination_url     → form.externalUrl
link_label          → form.externalLabel
show_after_purchase → form.externalShowAfterPurchase
```

Save under `builder_config.type_settings`.

#### Custom Service

`type_record` maps:

```text
duration_minutes      → form.serviceSessionDuration
platform              → form.servicePlatform
buffer_before_minutes → form.serviceBufferBefore
buffer_after_minutes  → form.serviceBufferAfter
max_bookings_per_day  → form.serviceMaxBookingsPerDay
advance_booking_days  → form.serviceAdvanceBookingDays
custom_meeting_url    → form.serviceMeetingUrl
```

Save under `builder_config.type_settings`.

### Marketing Mapping

The get-product `marketing` object maps to:

```text
enable_reviews             → form.enableReviews
email_flows                → form.emailFlows
order_bumps                → form.orderBumps
affiliate_share            → form.affiliateShare
upsell_after_purchase      → form.upsellAfterPurchase
confirmation_email_subject → form.emailSubject
confirmation_email_body    → form.emailBody
collect_fields             → collectFields
```

`marketing.collect_fields` may be a JSON string and must be parsed safely.
Name and email fields remain locked in the UI.

### Product Preview

The right-side preview has Card and Checkout modes.

`ProductStorePreview.js` renders card styles:

```text
button
callout
preview
```

Keep card and checkout typography and CTA sizing visually consistent.
Badge color comes from `form.badge_color` and is exposed to CSS through `--ap2-badge-color`.

### Draft Storage

Local drafts use:

```text
creator_add_product_draft
```

Local draft data is normalized before hydration.
A draft containing `product_uuid` represents a server-created product and uses the update endpoint on subsequent saves, but add-mode tabs remain locked until Thumbnail saves successfully in the current session.

### Standalone HTML

`add-product.html` is not the source of truth for the Vue SPA product form.
The active SPA flow is:

```text
Add_Product.js or Edit_Product.js
→ ProductFormContainer.js
→ product tab components
→ useProductForm.js
```

Do not copy product logic into `add-product.html` unless the task explicitly targets that standalone page.

## Before Commit

Verify:

* No build tool introduced
* Vue 3 CDN architecture preserved
* Dynamic imports still working
* Routes updated if required
* No console errors
* Mobile responsive
* API logic remains in services
* Add and edit still use `ProductFormContainer`
* Badge fields remain parent payload keys
* All four product types hydrate and save through existing form fields
* Add-mode tab locking still depends on successful first API save

## Summary

The admin app follows a straightforward Vue 3 architecture:

index.html loads global dependencies and the app module.
main.js creates and mounts the Vue app.
App.js wraps the app in theme/sidebar providers and renders the active route.
router/index.js manages protected routes and lazy-loaded pages.
AdminLayout.js provides the shared admin shell.
webService.js centralizes API communication through Axios.
When modifying this project, preserve the separation between:

Routing logic.
Layout/providing logic.
View-specific business logic.
API communication.
Validation and user feedback.
