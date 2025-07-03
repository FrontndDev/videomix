<template>
  <button
      class="button-video-mix"
      :class="props.color"
  >
    {{ props.text }}
  </button>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'purple'
  }
})

</script>

<style lang="scss" scoped>
@import "button";
</style>