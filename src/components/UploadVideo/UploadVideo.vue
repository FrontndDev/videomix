<template>
  <div
      @drop="handleDrop"
      @dragover.prevent
      class="upload"
      ref="container"
      :style="{ width: `${ newWidthBlockVideoState }px` }"
  >
    <video
        v-if="visibleSecondVideo === 'page 2'"
        :src="urlSecondVideo && visibleSecondVideo === 'page 2' ? urlSecondVideo : urlFirstVideo"
        class="upload__video"
        autoplay
        loop
        muted
        playsinline
        controls
        preload="auto"
    />
    <video
        v-if="['page 3', 'page 4', 'page 5'].includes(<string>visibleSecondVideo) || visibleFirstVideo === 2"
        :src="urlFirstVideo"
        :class="{ 'upload__flipped' : mirrorVideo && flippedVideo }"
        class="upload__video upload__video_first"
        autoplay
        loop
        muted
        playsinline
        :controls="!flippedVideo"
        preload="auto"
        ref="uploadVideo"
    />
    <div v-if="!loadingFiles && !loadingBlock" class="upload__content">
      <img src="@/assets/svg/video-upload.svg" alt="">
      <span>Загрузите <span class="upload__video-mobile">или перетащите</span> вертикальное видео формата mp4 или mov до 30 Мб</span>
    </div>
    <div v-if="!loadingFiles && !loadingBlock" class="upload__btn">
      <div v-if="visibleSecondVideo !== 'page 3' && visibleSecondVideo !== 'page 4'">
        <Button
            v-if="!videoUrl"
            color="white"
            text="Выбрать"
            @click="triggerFileInputClick"
        />
      </div>
      <input
          @change="handleFileUpload"
          type="file"
          id="file_uploader"
          accept=".mp4, .mov"
          ref="fileInput"
      >
    </div>
    <div v-if="loadingBlock" class="upload__loader">
      <Loader />
      <span>Идет загрузка видео...</span>
    </div>
    <div v-show="visibleSecondVideo === 'page 4' || visibleSecondVideo === 'page 5'">
      <img
          ref="sticker"
          class="upload__sticker"
          :src="urlSticker?.toString()"
          :style="{ width: newWidthSticker + 'px !important' }"
          @mousedown="startDrag"
          @touchstart="startDrag"
          @mousemove="dragging"
          @touchmove="dragging"
          @mouseup="endDrag"
          @touchend="endDrag"
          @dragstart.prevent
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import Loader from "@/components/UI/Loader/loader.vue";
import { computed, defineEmits, defineProps, PropType, ref, Ref, watch } from 'vue';
import { useStore } from "vuex";
import Button from "@/components/UI/Button/Button.vue";

const store = useStore()
const stateVideo = store.state.video

const props = defineProps({
  fileUploaded: {
    type: [File, null] as PropType<File | null>
  },
  urlSticker: {
    type: [String, null] as PropType<String | null>
  },
  fileSticker: {
    type: [File, null] as PropType<File | null>
  },
  loadingFiles: {
    type: Boolean,
    default: false
  },
  loadingBlock: {
    type: Boolean
  },
  visibleFirstVideo: {
    type: Number
  },
  visibleSecondVideo: {
    type: String
  },
})

const emit = defineEmits([
  'upload-file',
  'set-sticker-position'
])

const videoUrl: Ref<string> = ref('')
let flippedVideo = ref(false)
let startX = 0
let startY = 0
const x = ref(0)
const y = ref(0)
let xCalc = ref(0)
let yCalc = ref(0)
let widthSticker = ref<number | null>(null)
let stateNewWidth = ref<number | null>(null)
let stateNewHeight = ref<number | null>(null)
let newWidthBlockVideo = ref<number | null>(null)

let isDragging = false
let isDraggingIcon = false
const sticker = ref<HTMLImageElement | null>(null)
const container = ref<HTMLDivElement | null>(null)
const uploadVideo = ref<HTMLDivElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const isMobile = computed(() => window.innerWidth < 992)
const urlFirstVideo = computed(() => stateVideo.stateVideoProcessing.video1_url)
const urlSecondVideo = computed(() => stateVideo.stateVideoProcessing.video2_url)
const mirrorVideo = computed(() => stateVideo.uploadCheckboxes?.[5].checked)
const newWidthSticker = computed(() => stateVideo.newWidthStickerState)
const newWidthBlockVideoState = computed(() => stateVideo.newWidthVideo)
const actualWidthVideo = computed(() => stateVideo.actualWidthVideo)
const actualHeightVideo = computed(() => stateVideo.actualHeightVideo)

const triggerFileInputClick = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  target.value = ''
}

const updateVideoUrl = (file: File) => {
  videoUrl.value = URL.createObjectURL(file)
}

const handleFileUpload = (event: Event) => {
  try {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (file !== null && file !== undefined) {
      updateVideoUrl(file)
      emit('upload-file', file)
      handleFileInputChange(event)
    }
  } catch (error) {
    console.error("Ошибка при загрузке файла:", error)
  }
}

//******** Перемещение Стикера *******
const startDrag = (event: MouseEvent | TouchEvent) => {
  if (props.visibleSecondVideo === 'page 4') {
    try {
      isDraggingIcon = true

      if (event.type === 'mousedown') {
        const mouseEvent = event as MouseEvent
        startX = mouseEvent.clientX - x.value
        startY = mouseEvent.clientY - y.value
      } else {
        const touchEvent = event as TouchEvent
        const touch = touchEvent.touches[0]
        startX = touch.clientX - x.value
        startY = touch.clientY - y.value
      }
      isDragging = true
      document.addEventListener('mousemove', dragging, { passive: false })
      document.addEventListener('touchmove', dragging, { passive: false })
      document.addEventListener('mouseup', endDrag)
      document.addEventListener('touchend', endDrag)
    } catch (error) {
      console.error(error)
    }
  }
}

const dragging = (event: MouseEvent | TouchEvent) => {
  if (isDragging && sticker.value && container.value) {
    if (event.type === 'touchmove') {
      event.preventDefault()
    }

    let clientX, clientY
    if (event.type === 'mousemove') {
      const mouseEvent = event as MouseEvent
      clientX = mouseEvent.clientX
      clientY = mouseEvent.clientY
    } else {
      const touchEvent = event as TouchEvent
      const touch = touchEvent.touches[0]
      clientX = touch.clientX
      clientY = touch.clientY
    }

    const containerRect = container.value.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    let newX = clientX - startX
    let newY = clientY - startY

    newX = Math.max(0, Math.min(newX, containerWidth - sticker.value.width))
    newY = Math.max(0, Math.min(newY, containerHeight - sticker.value.height))

    x.value = newX
    y.value = newY

    sticker.value.style.left = `${x.value}px`
    sticker.value.style.top = `${y.value}px`
  }
}

const endDrag = () => {
  isDragging = false
  isDraggingIcon = false
  document.removeEventListener('mousemove', dragging)
  document.removeEventListener('touchmove', dragging)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchend', endDrag)

  const containerRect = container.value?.getBoundingClientRect()
  const containerWidth = containerRect?.width
  const containerHeight = containerRect?.height

  const xCalcValue = actualWidthVideo.value && containerWidth && containerWidth
      ? Math.round(actualWidthVideo.value / containerWidth * x.value)
      : 0
  const yCalcValue = actualHeightVideo.value && containerHeight && containerHeight
      ? Math.round(actualHeightVideo.value / containerHeight * y.value)
      : 0

  xCalc.value = xCalcValue
  yCalc.value = yCalcValue

  emit('set-sticker-position', xCalc.value, yCalc.value)
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()

  if (isDraggingIcon) {
    return
  }

  if (event.dataTransfer?.types.includes('Files')) {
    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      const file = files[0]
      updateVideoUrl(file)
      emit('upload-file', file)
    }
  }
}

watch(() => stateVideo.loadingFinalVideo || stateVideo.statusFailure, () => {
  widthSticker.value = null
  x.value = 0
  y.value = 0
  xCalc.value = 0
  yCalc.value = 0

  if (sticker.value) {
    sticker.value.style.width = ''
    sticker.value.style.top = ''
    sticker.value.style.left = ''
  }
})

watch(() => props.visibleSecondVideo, pageNumber => {
  if (pageNumber === 'page 4') {
    const maxWidth = 1080
    const maxHeight = 1920
    const videoElement = uploadVideo.value

    if (videoElement instanceof HTMLVideoElement) {
      const defaultVideoWidth = videoElement.videoWidth
      const defaultVideoHeight = videoElement.videoHeight

      if (defaultVideoWidth !== 0 && defaultVideoHeight !== 0) {
        let newWidth = defaultVideoWidth
        let newHeight = defaultVideoHeight
        const aspectRatio = maxWidth / maxHeight

        if (defaultVideoWidth > maxWidth || defaultVideoHeight > maxHeight) {
          newHeight = Math.min(defaultVideoHeight, maxHeight)
          newWidth = Math.round(newHeight * aspectRatio)

          if (newWidth > maxWidth) {
            newWidth = maxWidth
            newHeight = Math.round(newWidth / aspectRatio)
          }
        }

        if (newWidth % 2 !== 0) newWidth += 1
        if (newHeight % 2 !== 0) newHeight += 1

        if (newWidth > 0 && newHeight > 0) {
          stateNewWidth.value = newWidth
          stateNewHeight.value = newHeight
        } else {
          stateNewWidth.value = maxWidth
          stateNewHeight.value = maxHeight
        }

        stateVideo.actualWidthVideo = stateNewWidth.value
        stateVideo.actualHeightVideo = stateNewHeight.value

        newWidthBlockVideo.value = Math.round((isMobile.value ? 480 : 396) * (stateNewWidth.value / stateNewHeight.value))

        store.commit('video/UPDATE_NEW_WIDTH_VIDEO', newWidthBlockVideo.value)
      }

      widthSticker.value = null
      if (sticker.value) sticker.value.style.width = ''

      setTimeout(() => {
        requestAnimationFrame(() => {
          if (sticker.value) {
            const naturalStickerWidth = sticker.value.naturalWidth

            if (stateNewWidth.value && newWidthBlockVideo.value) {
              const newWidthSticker = Math.round((newWidthBlockVideo.value / stateNewWidth.value) * naturalStickerWidth)
              store.commit('video/UPDATE_NEW_WIDTH_STICKER', newWidthSticker)
            }
          }
        })
      }, 0)
    }
  } else if (pageNumber === 'page 1' || pageNumber === 'page 3') {
    if (container.value) container.value.style.width = ''
    stateVideo.newWidthVideo = null
    store.commit('video/UPDATE_NEW_WIDTH_VIDEO', null)
  }
})

watch(() => props.fileUploaded, newValue => {
  videoUrl.value = newValue ? URL.createObjectURL(newValue) : ''
})

watch(() => props.visibleSecondVideo, newValue => {
  if (sticker.value) {
    sticker.value.style.cursor = (newValue && props.visibleSecondVideo === 'page 5') ? 'default' : 'pointer'
  }

  flippedVideo.value = (props.visibleSecondVideo === 'page 4' || props.visibleSecondVideo === 'page 5')
})

</script>

<style scoped lang="scss">
@import "uploadVideo";
</style>