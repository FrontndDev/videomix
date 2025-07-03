<template>
  <div class="checkbox-video-mix">
    <input
        type="checkbox"
        :id="'checkbox_' + checkbox.id"
        :checked="isChecked"
        @change="handleChange"
    >
    <label :for="'checkbox_' + checkbox.id">
      {{ checkbox.label }}
    </label>
    <TextHints
        :text-hint="checkbox.textHint"
        :is-visible="isHintVisible"
        in-component
        @toggle-hint="handleToggleHint"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import {TextHints} from 'shared/ui';

const props = defineProps({
  checkbox: {
    type: Object,
    required: true
  },
})

const emits = defineEmits(['change-checkbox', 'toggle-hint'])

const isChecked = ref(props.checkbox.checked)
const isHintVisible = ref(false)

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  isChecked.value = target.checked
  emits('change-checkbox', { id: props.checkbox.id, checked: isChecked.value })
}

const handleToggleHint = (visible: boolean) => {
  isHintVisible.value = visible
  emits('toggle-hint', visible)
}

watch(() => props.checkbox.checked, (newChecked) => {
  isChecked.value = newChecked
})
</script>

<style scoped lang="scss">
@import "checkbox";
</style>
