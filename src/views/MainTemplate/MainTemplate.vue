<template>
  <FirstVideoUpload
      v-if="layouts === 1"
      :visible-first="visibleFirst"
      @open-second-video="openSecondVideo"
      @change-visible-first="visibleFirst = true"
  />
  <SecondVideoUpload
      v-show="layouts === 2"
      @open-first-video="backFirstVideo"
      @open-available-download="openAvailableDownload"
  />
  <AvailableDownload
      v-if="layouts === 3"
      @download-new-video="downloadNewVideo"
  />
</template>

<script lang="ts" setup>
import FirstVideoUpload from "@/layouts/FirstVideoUpload/FirstVideoUpload.vue";
import SecondVideoUpload from "@/layouts/SecondVideoUpload/SecondVideoUpload.vue";
import AvailableDownload from "@/layouts/AvailableDownload/AvailableDownload.vue";

import { ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore()

const layouts = ref(1)
const visibleFirst = ref(true)

const backFirstVideo = () => {
  layouts.value = 1
  visibleFirst.value = !visibleFirst.value
}

const openSecondVideo = () => {
  layouts.value = 2
  visibleFirst.value = true
}

const openAvailableDownload = () => {
  layouts.value = 3
}

const downloadNewVideo = () => {
  layouts.value = 1

  const video = store.state.video
  video.stateVideoProcessing.video1_url = ''
  video.stateVideoProcessing.video2_url = ''
  video.stateVideoProcessing.image_url = ''
  video.uploadCheckboxes = null
  video.copyData = []
  video.urlDownloadVideo = ''
  video.taskInfo = ''
  video.loadingFinalVideo = false
  video.counter = 0
  video.loadingFinalVideo = false
  video.newWidthVideo = null
  store.commit('video/CLEAR_LOADING_FILES', 'video1_url')
  store.commit('video/CLEAR_LOADING_FILES', 'video2_url')
  store.commit('video/CLEAR_LOADING_FILES', 'image_url')
  store.commit('video/CLEAR_INTERVAL', 'full')
}

watch(() => store.state.video.statusFailure, () => {
  downloadNewVideo()
})

</script>

<style lang="scss" scoped>
@import "mainTemplate";
</style>