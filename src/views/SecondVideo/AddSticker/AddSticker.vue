<template>
  <div class="add-sticker">
    <div class="add-sticker__title">
      <span>Добавьте стикер на видео или пропустите шаг</span>
      <TextHints text-hint="Добавление стикера на ваше видео не только украшает его и стимулирует взаимодействия со зрителями, но и способствует уникализации. Вы можете использовать эту функцию для вставки водяного знака, анимированного стикера с призывом к действию, логотипа бренда или любого другого изображения. Если вам не нужно добавлять дополнительные элементы, можете пропустить этот шаг." />
    </div>
    <div class="add-sticker__block">
      <div class="add-sticker__buttons">
        <div class="add-sticker__file">
          <label for="sticker">Загрузить стикер</label>
          <input @change="handleStickerUpload" type="file" id="sticker" accept=".jpg, .png, .gif">
        </div>
        <Button
            text="Вернуться назад"
            color="white"
            @click="backUpload"
        />
      </div>
      <span>* Поддерживаемые форматы jpg, png и gif</span>
      <button @click="skipAddSticker">Пропустить шаг</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/UI/Button/Button.vue";
import {TextHints} from 'shared/ui';

import { defineEmits } from 'vue'

const emits = defineEmits([
  'back-upload',
  'upload-sticker',
  'skip-add-sticker'
])

const backUpload = () => {
  emits('back-upload')
}

const handleStickerUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if(file !== null && file !== undefined) {
    emits('upload-sticker', file)
  }
}

const skipAddSticker = () => {
  emits('skip-add-sticker')
}

</script>

<style scoped lang="scss">
@import "addSticker";
</style>
