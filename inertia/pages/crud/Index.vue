<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ entity.plural }}</h1>
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.name"
              class="px-4 py-3 text-left font-medium text-gray-500"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr
            v-for="entry in entries.data"
            :key="String(entry.id)"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
            @click="$inertia.visit(`${route}/${entry.id}`)"
          >
            <CrudColumn
              v-for="column in columns"
              :key="column.name"
              :type="column.type"
              :attribute="column.attribute"
              :entry="entry"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import CrudColumn from './components/CrudColumn.vue'
import type { ColumnConfig, CrudEntityNames } from './components/types'

defineProps<{
  columns: ColumnConfig[]
  entries: { data: Record<string, unknown>[] }
  entity: CrudEntityNames
  route: string
}>()
</script>
