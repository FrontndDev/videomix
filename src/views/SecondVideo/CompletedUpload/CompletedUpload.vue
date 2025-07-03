<template>
  <div class="completed-upload">
    <span class="completed-upload__title">Файлы успешно загружены и готовы к обработке</span>
    <div class="completed-upload__buttons">
      <Button
          text="Начать обработку"
          color="purple"
          @click="startProcessing"
      />
      <Button
          text="Вернуться назад"
          color="white"
          @click="backSuccessSticker"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "@/components/UI/Button/Button.vue";

import { defineEmits } from 'vue'

const emits = defineEmits([
  'start-processing',
  'back-success-sticker'
])

const startProcessing = () => {
  emits('start-processing')
}

const backSuccessSticker = () => {
  emits('back-success-sticker')
}

</script>

<style lang="scss" scoped>
@import "completedUpload";
</style>