import type { HttpContext } from '@adonisjs/core/http'
import type CrudPanel from '../crud_panel.js'

export async function updateEntry(
  { params, request, response, session }: HttpContext,
  crud: CrudPanel
) {
  const Model = crud.getModel()
  const entry = await Model.findOrFail(params.id)
  const fieldNames = crud.getFields().map((field) => field.name)
  const payload = request.only(fieldNames)

  entry.merge(payload)
  await entry.save()

  session.flash('success', `${capitalize(crud.entityNames.singular)} updated`)
  return response.redirect(`${crud.route}/${entry.id}`)
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
