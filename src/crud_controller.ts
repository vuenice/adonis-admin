import type { HttpContext } from '@adonisjs/core/http'
import CrudPanel from './crud_panel.js'
import { listIndex } from './operations/list_operation.js'
import { showEntry } from './operations/show_operation.js'
import { updateEntry } from './operations/update_operation.js'

export default class CrudController {
  crud = new CrudPanel()

  protected setup(): void {}

  protected setupListOperation(): void {}

  protected setupShowOperation(): void {}

  protected setupUpdateOperation(): void {}

  protected boot(operation: 'list' | 'show' | 'update') {
    this.crud = new CrudPanel()
    this.setup()
    this.crud.setOperation(operation)

    if (operation === 'list') {
      this.setupListOperation()
      return
    }

    if (operation === 'show') {
      this.setupShowOperation()
      this.crud.setOperation('update')
      this.setupUpdateOperation()
      return
    }

    this.setupUpdateOperation()
  }

  async index(ctx: HttpContext) {
    this.boot('list')
    return listIndex(ctx, this.crud)
  }

  async show(ctx: HttpContext) {
    this.boot('show')
    return showEntry(ctx, this.crud)
  }

  async update(ctx: HttpContext) {
    this.boot('update')
    return updateEntry(ctx, this.crud)
  }
}
