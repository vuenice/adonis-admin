<template>
  <div class="max-w-3xl">
    <Link :href="route" class="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">← Back</Link>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      {{ titleCase(entity.singular) }} #{{ entry.id }}
    </h1>

    <form
      class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4"
      @submit.prevent="submit"
    >
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div v-for="column in columns" :key="column.name">
          <span class="text-gray-500">{{ column.label }}</span>
          <p class="font-medium">
            <CrudBadge
              v-if="column.type === 'badge' && cellValue(column)"
              :label="String(cellValue(column))"
            />
            <template v-else>{{ cellValue(column) || '—' }}</template>
          </p>
        </div>
      </div>

      <template v-if="fields.length">
        <CrudField
          v-for="field in fields"
          :key="field.name"
          v-model="form[field.name]"
          :type="field.type"
          :label="field.label"
          :options="field.options"
        />

        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Save
        </button>
      </template>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm, Link } from '@inertiajs/vue3'
import CrudBadge from './components/CrudBadge.vue'
import CrudField from './components/CrudField.vue'
import type { ColumnConfig, CrudEntityNames, FieldConfig } from './components/types'

const props = defineProps<{
  columns: ColumnConfig[]
  fields: FieldConfig[]
  entry: Record<string, unknown>
  entity: CrudEntityNames
  route: string
}>()

const formData: Record<string, unknown> = {}
for (const field of props.fields) {
  formData[field.name] = props.entry[field.attribute]
}

const form = useForm(formData)

function readAttribute(entry: Record<string, unknown>, attribute: string) {
  return attribute.split('.').reduce<unknown>((value, key) => {
    if (value == null || typeof value !== 'object') return null
    return (value as Record<string, unknown>)[key]
  }, entry)
}

function cellValue(column: ColumnConfig) {
  const raw = readAttribute(props.entry, column.attribute)
  if (raw == null || raw === '') return null
  if (column.type === 'date') {
    return new Date(String(raw)).toLocaleDateString()
  }
  return raw
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function submit() {
  form.put(`${props.route}/${props.entry.id}`)
}
</script>
