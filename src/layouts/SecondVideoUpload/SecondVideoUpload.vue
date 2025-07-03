<template>
  <div class="container">
    <div
        class="second-video__wrapper"
        ref="wrapper"
    >
      <div class="upload__video-desktop">
        <UploadVideo
            @upload-file="uploadFile"
            @set-sticker-position="setStickerPosition"
            :file-uploaded="fileUploaded"
            :url-sticker="urlSticker"
            :file-sticker="fileSticker"
            :loading-files="loadingVideoTwo"
            :loading-block="loadingBlockVideoTwo"
            :visible-second-video="visibleSecondVideo"
        />
      </div>
      <div class="upload__video-mobile">
        <UploadVideo
            v-if="visibleMobileVideo"
            @upload-file="uploadFile"
            @set-sticker-position="setStickerPosition"
            :file-uploaded="fileUploaded"
            :url-sticker="urlSticker"
            :file-sticker="fileSticker"
            :loading-files="loadingVideoTwo"
            :loading-block="loadingBlockVideoTwo"
            :visible-second-video="visibleSecondVideo"
        />
      </div>
      <div v-if="visibleSecondVideo === 'page 0'" class="second-video__load">
        <span>Подождите, пока загрузится второе видео</span>
      </div>
      <div>
        <SelectSecondVideo
            v-if="visibleSecondVideo === 'page 1'"
            @open-first-video="$emit('open-first-video')"
            @open-success-upload="openSuccessUpload"
        />
        <SuccessUpload
            v-else-if="visibleSecondVideo === 'page 2'"
            @success-upload="successUpload"
            @back-upload="backUpload"
        />
        <AddSticker
            v-else-if="visibleSecondVideo === 'page 3'"
            @upload-sticker="uploadSticker"
            @skip-add-sticker="skipAddSticker"
            @back-upload="backSuccessUpload"
        />
        <SuccessSticker
            v-else-if="visibleSecondVideo === 'page 4'"
            @back-add-sticker="backAddSticker"
            @open-completed-upload="visibleSecondVideo = 'page 5'"
        />
        <CompletedUpload
            v-if="visibleSecondVideo === 'page 5'"
            @start-processing="startProcessing"
            @back-success-sticker="backSuccessSticker"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UploadVideo from "@/components/UploadVideo/UploadVideo.vue";
import SelectSecondVideo from "@/views/SecondVideo/SelectSecondVideo/SelectSecondVideo.vue";
import SuccessUpload from "@/views/SecondVideo/SuccessUpload/SuccessUpload.vue";
import SuccessSticker from "@/views/SecondVideo/SuccessSticker/SuccessSticker.vue";
import AddSticker from "@/views/SecondVideo/AddSticker/AddSticker.vue";

import { onMounted, ref, watch } from "vue";

import { useStore } from 'vuex'
import CompletedUpload from "@/views/SecondVideo/CompletedUpload/CompletedUpload.vue";

const store = useStore()
const state = store.state

const fileUploaded = ref<File | null>(null)
const fileSticker = ref<File | null>(null)
const urlSticker = ref<String | null>(null)
const visibleSecondVideo = ref('page 1')
const loadingVideoTwo = ref(false)
const loadingBlockVideoTwo = ref(false)
const visibleMobileVideo = ref(true)
const wrapper = ref<HTMLDivElement | null>(null)

const emits = defineEmits([
    'open-available-download',
    'open-first-video'
])

interface Position {
  x: number;
  y: number;
}

interface VideoProcessingData {
  video1_url: string;
  video2_url: string;
  image_url: string;
  speed_percentage: number;
  add_noise: boolean;
  adjust_color: boolean;
  mirror_image: boolean;
  generate_metadata: boolean;
  invisible_object: boolean;
  image_position: Position | null;
}

const dataVideoProcessing = ref<VideoProcessingData>({
  video1_url: '',
  video2_url: '',
  image_url: '',
  speed_percentage: 100,
  add_noise: false,
  adjust_color: false,
  mirror_image: false,
  generate_metadata: false,
  invisible_object: false,
  image_position: null
})

watch(() => state.video.loadingFiles.video2_url, () => {
  loadingVideoTwo.value = false
  visibleSecondVideo.value = 'page 2'
})

watch(visibleSecondVideo, (pageNumber) => {
  if (pageNumber === 'page 2' || pageNumber === 'page 3') {
    visibleMobileVideo.value = false
  } else {
    visibleMobileVideo.value = true
  }
})

watch(() => state.video.errorVideo, () => {
  if (visibleSecondVideo.value === 'page 0') {
    visibleSecondVideo.value = 'page 1'
    loadingVideoTwo.value = false
    fileUploaded.value = null
    loadingBlockVideoTwo.value = false
  }
})

watch(() => state.video.loadingFinalVideo || state.video.statusFailure, () => {
  visibleSecondVideo.value = 'page 1'
  urlSticker.value = null
})

const uploadFile = (file: File) => {
  fileUploaded.value = file
  store.dispatch('video/downloadFile', { file: file, type: 'video', key: 'video2_url' })

  visibleSecondVideo.value = 'page 0'
  loadingVideoTwo.value = true
  loadingBlockVideoTwo.value = true
}

const openSuccessUpload = () => {
  if (state.video.stateVideoProcessing.video2_url) {
    visibleSecondVideo.value = 'page 2'
  } else {
    visibleSecondVideo.value = 'page 3'
  }
}

const backSuccessUpload = () => {
  if (state.video.stateVideoProcessing.video2_url) {
    visibleSecondVideo.value = 'page 2'
    fileUploaded.value = null
    loadingBlockVideoTwo.value = false
  } else {
    visibleSecondVideo.value = 'page 1'
    fileUploaded.value = null
    loadingBlockVideoTwo.value = false
  }
}

const backUpload = () => {
  fileUploaded.value = null
  loadingBlockVideoTwo.value = false

  setTimeout(() => {
    visibleSecondVideo.value = 'page 1'
  }, 50)
}

const successUpload = () => {
  dataVideoProcessing.value.video2_url = state.video.stateVideoProcessing.video2_url
  visibleSecondVideo.value = 'page 3'
}

const uploadSticker = (file: File) => {
  urlSticker.value = URL.createObjectURL(file)
  fileSticker.value = file
  if (file) {
    visibleSecondVideo.value = 'page 4'
  }
  dataVideoProcessing.value.image_position = { x: 0, y: 0 }
  store.dispatch('video/downloadFile', { file: file, type: 'sticker', key: 'image_url' })
  handleCheckboxChange()
}

const skipAddSticker = () => {
  dataVideoProcessing.value.video2_url = state.video.stateVideoProcessing.video2_url
  if (state.video.stateVideoProcessing.image_url) {
    visibleSecondVideo.value = 'page 4'
  } else {
    visibleSecondVideo.value = 'page 5'
  }
  handleCheckboxChange()
}

const startProcessing = () => {
  dataVideoProcessing.value.video1_url = state.video.stateVideoProcessing.video1_url
  dataVideoProcessing.value.image_url = state.video.stateVideoProcessing.image_url
  store.dispatch("video/videoProcessing", dataVideoProcessing.value)
  emits('open-available-download')
}

const backAddSticker = () => {
  visibleSecondVideo.value = 'page 3'
  state.video.newWidthVideo = null
}

watch(() => state.video.newWidthVideo, newValue => {
  if (newValue) {
    if (wrapper.value !== null && wrapper.value !== undefined) {
      wrapper.value.style.gridTemplateColumns = `${newValue}px 1fr`
    }
  } else {
    if (wrapper.value !== null && wrapper.value !== undefined) {
      wrapper.value.style.gridTemplateColumns = ''
    }
  }
})

const backSuccessSticker = () => {
  if (state.video.stateVideoProcessing.image_url) {
    visibleSecondVideo.value = 'page 4'
  } else {
    visibleSecondVideo.value = 'page 3'
  }
}

const handleCheckboxChange = () => {
  const uploadCheckboxes = state.video.uploadCheckboxes
  if (Array.isArray(uploadCheckboxes)) {
    const speedUpCheckbox = uploadCheckboxes.find(checkbox => checkbox.key === 'speed_percentage_up')
    const speedDownCheckbox = uploadCheckboxes.find(checkbox => checkbox.key === 'speed_percentage_down')

    if (speedUpCheckbox && speedUpCheckbox.checked && speedDownCheckbox && speedDownCheckbox.checked) {
      dataVideoProcessing.value.speed_percentage = 100
    } else {
      if (speedUpCheckbox && speedUpCheckbox.checked) {
        dataVideoProcessing.value.speed_percentage = 101
      } else if (speedDownCheckbox && speedDownCheckbox.checked) {
        dataVideoProcessing.value.speed_percentage = 99
      }
    }

    uploadCheckboxes.forEach(checkbox => {
      if (checkbox.key !== 'speed_percentage_up' && checkbox.key !== 'speed_percentage_down') {
        (dataVideoProcessing.value as {[key: string]: any})[checkbox.key] = checkbox.checked
      }
    })
  }
}

const setStickerPosition = (x: number, y: number) => {
  if (urlSticker) {
    let xPosition = Math.round(x)
    let yPosition = Math.round(y)
    dataVideoProcessing.value.image_position = { x: xPosition, y: yPosition }
  }
}

onMounted(() => {
  dataVideoProcessing.value.video1_url = state.video.stateVideoProcessing.video1_url
  visibleSecondVideo.value = 'page 1'
})

</script>

<style scoped lang="scss">
@import "secondVideoUpload";
</style>