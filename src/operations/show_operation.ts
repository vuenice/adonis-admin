import type { HttpContext } from '@adonisjs/core/http'
import type CrudPanel from '../crud_panel.js'

export async function showEntry({ inertia, params }: HttpContext, crud: CrudPanel) {
  const Model = crud.getModel()
  const entry = await crud.applyQuery(Model.query().where('id', params.id)).firstOrFail()

  return inertia.render('crud/Show', {
    columns: crud.getColumns('show'),
    fields: crud.getFields(),
    entry: entry.serialize(),
    entity: crud.entityNames,
    route: crud.route,
  })
}
