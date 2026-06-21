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

## Before Commit

Verify:

* No build tool introduced
* Vue 3 CDN architecture preserved
* Dynamic imports still working
* Routes updated if required
* No console errors
* Mobile responsive
* API logic remains in services

```
```
Summary
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
