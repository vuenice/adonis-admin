# adonis-admin

Reusable CRUD engine and Inertia Vue pages for AdonisJS admin apps (list, show, update).

## Requirements

- AdonisJS 6 or 7 with Lucid, Inertia (Vue), and Session
- Vue 3
- Tailwind CSS in the host app (CRUD pages use utility classes)

## Install

```bash
npm install adonis-admin
```

Local development (monorepo / `file:` link):

```json
{
  "dependencies": {
    "adonis-admin": "file:./adonis-admin"
  }
}
```

No provider registration is required. The package is used via imports.

### Resolve CRUD pages from the package

CRUD operations render Inertia pages `crud/Index` and `crud/Show` that ship inside the package. Teach your host Inertia app to resolve them from `node_modules`:

```ts
// inertia/app/app.ts
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const pages = {
  ...import.meta.glob('../pages/**/*.vue'),
  ...import.meta.glob('../../node_modules/adonis-admin/inertia/pages/**/*.vue'),
}

createInertiaApp({
  resolve: async (name) => {
    const page = await resolvePageComponent(
      [
        `../pages/${name}.vue`,
        `../../node_modules/adonis-admin/inertia/pages/${name}.vue`,
      ],
      pages
    )
    // assign your admin layout here if needed
    return page
  },
  // ...
})
```

Optional Vite tweaks when developing against a local `file:` copy:

```ts
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['adonis-admin'],
  },
  // ...
})
```

## Create a CRUD resource

### 1. Controller

Extend `CrudController` and configure the panel in the setup hooks:

```ts
// app/controllers/posts_crud_controller.ts
import { CrudController } from 'adonis-admin'
import Post from '#models/post'

export default class PostsCrudController extends CrudController {
  protected setup() {
    this.crud.setModel(Post)
    this.crud.setRoute('/posts')
    this.crud.setEntityNameStrings('post', 'Posts')
    // Optional: relation preloads / query scopes
    // this.crud.query((query) => query.preload('author'))
  }

  protected setupListOperation() {
    this.crud.column('id')
    this.crud.column('title')
    this.crud.column('status').type('badge')
    this.crud.column('createdAt').type('date').label('Date')
  }

  protected setupShowOperation() {
    this.crud.column('title')
    this.crud.column('body')
    this.crud.column('status').type('badge')
  }

  protected setupUpdateOperation() {
    this.crud.field('status').type('select').options([
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
    ])
    this.crud.field('title').type('text')
    this.crud.field('body').type('textarea')
  }
}
```

**Column types:** `text` (default), `date`, `badge`  
**Field types:** `text` (default), `textarea`, `select` (pass `.options([{ label, value }])`)

Nested attributes work with dot paths (e.g. `user.fullName`) when you preload relations in `query()`.

Omit `setupUpdateOperation` (or leave it empty) for a read-only show page.

### 2. Routes

```ts
// start/routes.ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { registerCrudRoutes } from 'adonis-admin'

const PostsCrudController = () => import('#controllers/posts_crud_controller')

registerCrudRoutes(router, '/posts', PostsCrudController, middleware.auth())
```

This registers:

| Method | Path | Action |
|--------|------|--------|
| GET | `/posts` | list |
| GET | `/posts/:id` | show |
| PUT | `/posts/:id` | update |

### 3. Sidebar / menu

Navigation is owned by the host layout. Add a link to your resource path (e.g. `/posts`) in the admin sidebar.

## Custom (non-CRUD) pages

Custom admin screens (dashboard, multi-step forms, tools) stay in the **host app**. The package only owns the shared list/show/update CRUD UI.

Typical pattern:

1. **Controller** — render an Inertia page with props:

```ts
async index({ inertia }: HttpContext) {
  return inertia.render('admin/Dashboard', { stats })
}
```

2. **Vue page** — add `inertia/pages/admin/Dashboard.vue` (or any path under your host `inertia/pages/`).

3. **Route** — register a normal route pointing at the controller method.

4. **Sidebar** — add a menu entry in your host layout.

Host pages continue to resolve from `../pages/**/*.vue`; package CRUD pages resolve from `node_modules/adonis-admin/inertia/pages/**/*.vue`.

## API surface

```ts
import {
  CrudController,
  CrudPanel,
  registerCrudRoutes,
  FluentColumn,
  FluentField,
  humanize,
  toSerializedAttribute,
} from 'adonis-admin'
```

Optional empty provider (not required for current features):

```ts
// adonisrc.ts
() => import('adonis-admin/crud_provider'),
```

## Develop the package

```bash
cd adonis-admin
npm install
npm run build
```

Backend ships from `build/`. Vue pages ship from `inertia/` (not compiled by the package build).
