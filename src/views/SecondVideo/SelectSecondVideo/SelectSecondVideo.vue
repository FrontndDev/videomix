<template>
  <div class="select-second-video">
    <div class="select-second-video__title">
      <span>Выберите второе видео для склейки или пропустите шаг</span>
      <TextHints
          text-hint="Склейка вашего видео с другим может значительно увеличить его уникальность. Это также отличная возможность добавить во вторую часть видео призыв к действию или дополнительную информацию, которая может стимулировать взаимодействие зрителей. Если у вас нет подходящего второго видео, вы можете пропустить этот шаг."
      />
    </div>
    <div class="select-second-video__buttons">
      <div>
        <Button
            text="Загрузить видео"
            @click="triggerFileInputClick"
        />
        <Button
            text="Вернуться назад"
            color="white"
            @click="backFirstVideo"
        />
      </div>
      <button @click="$emit('open-success-upload')">Пропустить шаг</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/UI/Button/Button.vue";
import {TextHints} from 'shared/ui';

const emits = defineEmits([
    'open-first-video',
    'open-success-upload'
])

const backFirstVideo = () => {
  emits('open-first-video')
}

const triggerFileInputClick = () => {
  const fileInput = document.getElementById('file_uploader') as HTMLInputElement | null
  if (fileInput) {
    fileInput.click()
  }
}
</script>

<style scoped lang="scss">
@import "selectSecondVideo";
</style>
