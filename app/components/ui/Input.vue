<script setup lang="ts">
defineProps<{
  modelValue: string
  id: string
  type?: string
  placeholder?: string
  autocomplete?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input :id="id" :value="modelValue" :type="type || 'text'" :placeholder="placeholder" :autocomplete="autocomplete" class="min-w-0 flex-1 rounded-sm border-0 bg-surface-raised px-4 text-sm text-white outline-none placeholder:text-white focus-visible:outline-2 focus-visible:outline-lime" @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)">
</template>
