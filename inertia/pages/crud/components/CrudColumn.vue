<template>
  <td class="px-4 py-3" :class="type === 'date' ? 'text-gray-500' : ''">
    <CrudBadge v-if="type === 'badge' && displayValue" :label="String(displayValue)" />
    <template v-else>{{ displayValue || '—' }}</template>
  </td>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CrudBadge from './CrudBadge.vue'
import type { ColumnType } from './types'

const props = defineProps<{
  type: ColumnType
  attribute: string
  entry: Record<string, unknown>
}>()

function readAttribute(entry: Record<string, unknown>, attribute: string) {
  return attribute.split('.').reduce<unknown>((value, key) => {
    if (value == null || typeof value !== 'object') return null
    return (value as Record<string, unknown>)[key]
  }, entry)
}

const displayValue = computed(() => {
  const raw = readAttribute(props.entry, props.attribute)
  if (raw == null || raw === '') return null
  if (props.type === 'date') {
    return new Date(String(raw)).toLocaleDateString()
  }
  return raw
})
</script>
