import type { HttpContext } from '@adonisjs/core/http'
import type CrudPanel from '../crud_panel.js'

export async function listIndex({ inertia, request }: HttpContext, crud: CrudPanel) {
  const page = request.input('page', 1)
  const Model = crud.getModel()
  const entries = await crud
    .applyQuery(Model.query().orderBy('created_at', 'desc'))
    .paginate(page, 20)

  return inertia.render('crud/Index', {
    columns: crud.getColumns('list'),
    entries: entries.serialize(),
    entity: crud.entityNames,
    route: crud.route,
  })
}
