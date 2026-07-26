import type { LazyImport } from '@poppinss/utils/types'
import type CrudController from './crud_controller.js'

type CrudControllerConstructor = typeof CrudController

/**
 * Registers List + Show + Update routes for a CrudController (Backpack-style).
 */
export function registerCrudRoutes(
  appRouter: any,
  path: string,
  controller: LazyImport<CrudControllerConstructor>,
  middlewareFn: any
) {
  const base = path.startsWith('/') ? path : `/${path}`

  appRouter.get(base, [controller, 'index']).use(middlewareFn)
  appRouter.get(`${base}/:id`, [controller, 'show']).use(middlewareFn)
  appRouter.put(`${base}/:id`, [controller, 'update']).use(middlewareFn)
}
