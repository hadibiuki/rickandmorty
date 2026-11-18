<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'solid' | 'outline'
  disabled?: boolean
}>(), { type: 'button', variant: 'solid', disabled: false })
</script>

<template>
  <button :type="type" :disabled="disabled" class="cursor-pointer rounded-md px-5 py-2.5 font-semibold disabled:cursor-default disabled:opacity-50" :class="variant === 'solid' ? 'bg-lime text-ink hover:bg-lime-hover' : 'border border-lime bg-transparent text-lime hover:bg-lime hover:text-ink-soft'">
    <slot />
  </button>
</template>
