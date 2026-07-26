export type ColumnType = 'text' | 'date' | 'badge'

export type FieldType = 'text' | 'textarea' | 'select'

export type SelectOption = {
  label: string
  value: string
}

export type ColumnConfig = {
  name: string
  type: ColumnType
  label: string
  attribute: string
}

export type FieldConfig = {
  name: string
  type: FieldType
  label: string
  attribute: string
  options?: SelectOption[]
}

export type CrudEntityNames = {
  singular: string
  plural: string
}

export type LucidModelConstructor = {
  query: (...args: any[]) => any
  findOrFail: (id: string | number) => Promise<any>
  create: (data: Record<string, unknown>) => Promise<any>
}

export type CrudQueryCallback = (query: any) => any
