import { FluentColumn, FluentField } from './fluent.js'
import type {
  ColumnConfig,
  CrudEntityNames,
  CrudQueryCallback,
  FieldConfig,
  LucidModelConstructor,
} from './types.js'

type OperationKey = 'list' | 'show' | 'update'

export default class CrudPanel {
  model: LucidModelConstructor | null = null
  route = ''
  entityNames: CrudEntityNames = { singular: 'entry', plural: 'entries' }

  #columns: Record<OperationKey, FluentColumn[]> = {
    list: [],
    show: [],
    update: [],
  }

  #fields: Record<'update', FluentField[]> = {
    update: [],
  }

  #queryCallback: CrudQueryCallback | null = null

  #currentOperation: OperationKey = 'list'

  setModel(model: LucidModelConstructor) {
    this.model = model
    return this
  }

  setRoute(route: string) {
    this.route = route.startsWith('/') ? route : `/${route}`
    return this
  }

  setEntityNames(names: CrudEntityNames) {
    this.entityNames = names
    return this
  }

  setEntityNameStrings(singular: string, plural: string) {
    this.entityNames = { singular, plural }
    return this
  }

  setOperation(operation: OperationKey) {
    this.#currentOperation = operation
    return this
  }

  query(callback: CrudQueryCallback) {
    this.#queryCallback = callback
    return this
  }

  column(name: string) {
    const column = new FluentColumn(name)
    this.#columns[this.#currentOperation].push(column)
    return column
  }

  field(name: string) {
    const field = new FluentField(name)
    this.#fields.update.push(field)
    return field
  }

  getColumns(operation: OperationKey): ColumnConfig[] {
    return this.#columns[operation].map((column) => column.toConfig())
  }

  getFields(): FieldConfig[] {
    return this.#fields.update.map((field) => field.toConfig())
  }

  getModel(): LucidModelConstructor {
    return this.model!
  }

  applyQuery(query: any) {
    return this.#queryCallback ? this.#queryCallback(query) : query
  }
}
