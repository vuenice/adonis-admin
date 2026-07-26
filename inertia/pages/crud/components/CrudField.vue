<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ label }}</label>
    <select
      v-if="type === 'select'"
      :value="String(modelValue ?? '')"
      class="form-control w-full h-10"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in options ?? []" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <textarea
      v-else-if="type === 'textarea'"
      :value="String(modelValue ?? '')"
      rows="5"
      class="form-control w-full"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <input
      v-else
      :value="String(modelValue ?? '')"
      type="text"
      class="form-control w-full"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
import type { FieldType, SelectOption } from './types'

defineProps<{
  type: FieldType
  label: string
  modelValue: unknown
  options?: SelectOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
}>()
</script>
