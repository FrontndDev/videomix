<template>
  <div class="success-upload">
    <span class="success-upload__title">Выберите расположение стикера</span>
    <div class="success-upload__buttons">
      <Button
          text="Продолжить"
          color="purple"
          @click="openCompletedUpload"
      />
      <Button
          text="Вернуться назад"
          color="white"
          @click="backSticker"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "@/components/UI/Button/Button.vue";

import { defineEmits } from 'vue'

const emits = defineEmits([
  'open-completed-upload',
  'back-add-sticker'
])

const openCompletedUpload = () => {
  emits('open-completed-upload')
}

const backSticker = () => {
  emits('back-add-sticker')
}

</script>

<style lang="scss" scoped>
@import "successSticker";
</style>