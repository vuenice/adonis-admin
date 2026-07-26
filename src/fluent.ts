import type { ColumnConfig, ColumnType, FieldConfig, FieldType, SelectOption } from './types.js'

const CAMEL_BOUNDARY_RE = /([a-z0-9])([A-Z])/g

/** Lucid 21 defaults to CamelCaseNamingStrategy — serialized keys match model property names. */
export function toSerializedAttribute(name: string): string {
  return name
}

export function humanize(name: string): string {
  const spaced = name.replace(CAMEL_BOUNDARY_RE, '$1 $2')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

export class FluentColumn {
  #name: string
  #type: ColumnType = 'text'
  #label: string | null = null

  constructor(name: string) {
    this.#name = name
  }

  type(value: ColumnType) {
    this.#type = value
    return this
  }

  label(value: string) {
    this.#label = value
    return this
  }

  toConfig(): ColumnConfig {
    return {
      name: this.#name,
      type: this.#type,
      label: this.#label ?? humanize(this.#name),
      attribute: toSerializedAttribute(this.#name),
    }
  }
}

export class FluentField {
  #name: string
  #type: FieldType = 'text'
  #label: string | null = null
  #options: SelectOption[] | undefined

  constructor(name: string) {
    this.#name = name
  }

  type(value: FieldType) {
    this.#type = value
    return this
  }

  label(value: string) {
    this.#label = value
    return this
  }

  options(value: SelectOption[]) {
    this.#options = value
    return this
  }

  toConfig(): FieldConfig {
    return {
      name: this.#name,
      type: this.#type,
      label: this.#label ?? humanize(this.#name),
      attribute: toSerializedAttribute(this.#name),
      options: this.#options,
    }
  }
}
