<template>
  <div class="container">
    <div
        class="first-video__wrapper"
        :style="{ 'grid-template-columns': newWidthVideoState + 'px' + ' ' + '1fr'}"
    >
      <div
          class="upload"
          :style="{ 'width': newWidthVideoState + 'px' }"
          ref="container"
      >
        <video
            v-if="urlDownloadVideo"
            :src="urlDownloadVideo"
            class="upload__video"
            autoplay
            loop
            muted
            playsinline
            controls
            preload="auto"
        />
        <div v-else-if="error" class="upload__loader">
          <span>{{ error }}</span>
        </div>
        <div v-else class="upload__loader">
          <Loader />
          <span>Идет обработка видео...</span>
        </div>
        <div v-if="loadingFinalVideo" class="upload__loader">
          <Loader />
          <span>Идет загрузка видео...</span>
        </div>
      </div>

      <div class="available-download">
        <div v-if="error" class="available-download__block">
          <div class="available-download__title">{{ error }}</div>
          <Button
              @click="backSticker"
              text="Вернуться назад"
              color="white"
          />
        </div>
        <div v-else class="available-download__loader">
          <div>
            <Loader v-if="!urlDownloadVideo" />
            <span>{{ taskInfo ? taskInfo : 'Идет обработка... ' }}</span>
          </div>
          <span v-if="!urlDownloadVideo">Пожалуйста, подождите. Процесс генерации может занять несколько минут.</span>
        </div>
<!--        <div v-if="urlDownloadVideo" class="available-download__link">-->
<!--          <span>Поделиться: </span>-->
<!--          <a href="#">https://dream-14.online/app/videomix/project22</a>-->
<!--        </div>-->
        <div v-if="urlDownloadVideo" class="available-download__block">
          <div class="available-download__buttons">
            <a
                class="available-download__buttons-link"
                :href="urlDownloadVideo"
                target="_blank"
                download
            >
              Скачать
            </a>
            <div class="available-download__btn-copy">
              <Button
                  @click="generateCopy"
                  text="Сгенерировать копию"
                  color="white"
              />
              <TextHints
                  text-hint="Эта функция позволяет создать новую уникальную версию вашего видео с теми же параметрами уникализации, что вы выбирали, но с рандомизированными (случайными) значениями каждого параметра. Это идеальный способ для создания дополнительных уникальных версий, которые помогут максимизировать ваше присутствие и влияние на видеоплощадках."
              />
            </div>
            <button @click="downloadNewVideo" class="available-download__button">
              Загрузить новое видео
            </button>
          </div>
          <span>* Ссылка на скачивание доступна 24 часа после генерации.</span>
          <div class="available-download__copies">
            <div
                v-for="(item, idx) in copyData"
                class="available-download__copy"
            >
              <span>Копия {{ idx + 1 }}</span>
              <span>|</span>
              <a
                  :href="item.url"
                  download
                  target="_blank"
                  class="available-download__copy-link"
              >
                Скачать
              </a>
            </div>
            <div
                v-for="(item, idx) in copyItems"
                :key="item"
                class="available-download__copy"
            >
              <span>Копия {{ idx + 1 + copyData.length }}</span>
              <span>|</span>
              <Loader size="24" />
              <span> Идет обработка... <span class="available-download__copy-mobile"> Процесс генерации может занять несколько минут.</span> </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/UI/Button/Button.vue";
import Loader from "@/components/UI/Loader/loader.vue";

import { computed } from "vue";
import { useStore } from 'vuex'
import {TextHints} from 'shared/ui';

const store = useStore()
const state = store.state

const emits = defineEmits([
    'download-new-video'
])

const urlDownloadVideo = computed(() => state.video.urlDownloadVideo)
const taskInfo = computed(() => state.video.taskInfo)
const error = computed(() => state.notifications.error)
const copyData = computed(() => state.video.copyData)
const copyProcessing = computed(() => state.video.copyProcessing)
const loadingFinalVideo = computed(() => state.video.loadingFinalVideo)
const newWidthVideoState = computed(() => state.video.newWidthVideo)

const copyItems = computed(() => {
  return Object.keys(state.video.intervalId)?.length
})

const backSticker = () => {
  store.commit('notifications/CLEAR_ERROR')
}

const generateCopy = () => {
  if (copyProcessing) {
    store.dispatch('video/videoProcessing', state.video.dataVideoProcess)
    store.commit('video/START_COPY')
  }
}

const downloadNewVideo = () => {
  if (confirm('У вас есть несохраненные изменения. Вы уверены, что хотите загрузить новое видео?')) {
    emits('download-new-video')
  }
}

</script>

<style scoped lang="scss">
@import "availableDownload";
</style>
