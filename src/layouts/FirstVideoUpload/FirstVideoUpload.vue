<template>
  <div class="container">
    <div class="first-video__wrapper">
      <div class="upload__video-desktop">
        <UploadVideo
            @upload-file="uploadFile"
            :file-uploaded="fileUploaded"
            :loading-files="loadingVideoOne"
            :loading-block="loadingBlockVideoOne"
            :visible-first-video="visibleFirstVideo"
        />
      </div>
      <div class="upload__video-mobile">
        <UploadVideo
            v-if="visibleFirstVideo !== 2"
            @upload-file="uploadFile"
            :file-uploaded="fileUploaded"
            :loading-files="loadingVideoOne"
            :loading-block="loadingBlockVideoOne"
            :visible-first-video="visibleFirstVideo"
            :first-file-uploaded="fileUploaded"
        />
      </div>
      <div class="first-video__content">
        <div v-if="visibleFirstVideo === 1" class="first-video__without-video">
          <span>Загрузите видео, чтобы начать работу с сервисом</span>
          <span>Уникализация повышает шанс попасть в рекомендации, чтобы получать бесплатный органический трафик.</span>
        </div>
        <div v-else-if="visibleFirstVideo === 0" class="first-video__without-video">
          <span>Подождите, пока загрузится видео</span>
        </div>
        <div v-else-if="visibleFirstVideo === 2" class="first-video__select-options">
          <div class="first-video__block">
            <span>Выберите параметры уникализации или оставьте их по умолчанию:</span>
            <div class="first-video__checkboxes">
              <Checkbox
                  v-for="checkbox in checkboxes"
                  :key="checkbox.id"
                  :checkbox="checkbox"
                  @change-checkbox="handleCheckboxChange"
                  @toggle-hint="handleToggleHint"
              />
            </div>
          </div>
          <div class="first-video__select-options-buttons">
            <Button
                text="Продолжить"
                color="purple"
                @click="nextVideo"
            />
            <Button
                text="Вернуться назад"
                color="white"
                @click="backUpload"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UploadVideo from "@/components/UploadVideo/UploadVideo.vue";
import Button from "@/components/UI/Button/Button.vue";
import Checkbox from "@/components/UI/Checkbox/Checkbox.vue";

import { useStore } from 'vuex';
import { ref, watch, defineEmits, computed, onMounted } from "vue";

const store = useStore()
const state = store.state

const props = defineProps({
  visibleFirst: {
    type: Boolean
  }
})

const emits = defineEmits([
    'open-second-video',
    'change-visible-first',
    'download-new-video'
])

const checkboxes = ref([
  { label: 'Новые метаданные', id: 0, key: 'generate_metadata', checked: true, textHint: 'Использование новых метаданных увеличивает уникальность видео и шансы на успешное прохождение через системы модерации дублирующего контента на видеоплощадках.' },
  { label: 'Ускорить на 1%', id: 1, key: 'speed_percentage_up', checked: true, textHint: 'Небольшое ускорение может изменить временные характеристики видео, помогая ему обходить автоматические системы проверки на совпадение содержания. Это эффективный способ сделать видео уникальным без заметных визуальных изменений.' },
  { label: 'Наложить шумы', id: 2, key: 'add_noise', checked: true, textHint: 'Добавление шума в видео изменяет его визуальные характеристики, что может помочь пройти через автоматические системы модерации, обнаруживающие повторяющийся контент.' },
  { label: 'Замедлить на 1%', id: 3, key: 'speed_percentage_down', checked: false, textHint: 'Незначительное замедление видео на 1% изменяет его продолжительность и может помочь избежать автоматического распознавания дублирующего контента системами модерации.' },
  { label: 'Наложить невидимый элемент', id: 4, key: 'invisible_object', checked: true, textHint: 'Невидимый элемент поможет добавить уникальности без изменения визуальной части видео.' },
  { label: 'Отразить по горизонтали', id: 5, key: 'mirror_image', checked: false, textHint: 'Отражение видео изменяет его ориентацию, что может быть полезно для обхода автоматических проверок на сходство с уже известными видео. Если в вашем видео присутствует текст, он также будет отражён и может стать нечитаемым.' },
  { label: 'Изменить насыщенность', id: 6, key: 'adjust_color', checked: true, textHint: 'Изменение насыщенности может существенно отличать ваше видео от оригинала, что помогает обойти системы идентификации дубликатов.' },
])

const fileUploaded = ref<File | null>(null)
const loadingVideoOne = ref(false)
const loadingBlockVideoOne = ref(false)
const activeHintId = ref<number | null>(null)
const visibleFirstVideo = ref(1)
const urlFirstVideo = computed(() => state.video.stateVideoProcessing.video1_url)

const uploadFile = (file: File) => {
  fileUploaded.value = file
  store.dispatch('video/downloadFile', { file: file, type: 'video', key: 'video1_url' })
  loadingVideoOne.value = true
  loadingBlockVideoOne.value = true
  visibleFirstVideo.value = 0
}

const backUpload = () => {
  fileUploaded.value = null
  loadingBlockVideoOne.value = false
  state.video.loadingFiles.video1_url = null
  state.video.stateVideoProcessing.video1_url = ''
  setTimeout(() => {
    visibleFirstVideo.value = 1
  }, 50)
  emits('change-visible-first')
}

const handleCheckboxChange = ({ id, checked }: { id: number, checked: boolean }) => {
  const checkbox = checkboxes.value.find(c => c.id === id)
  if (checkbox) {
    checkbox.checked = checked
    if (id === 1 && checked) {
      const otherCheckbox = checkboxes.value.find(c => c.id === 3)
      if (otherCheckbox) {
        otherCheckbox.checked = false
      }
    } else if (id === 3 && checked) {
      const otherCheckbox = checkboxes.value.find(c => c.id === 1)
      if (otherCheckbox) {
        otherCheckbox.checked = false
      }
    }
  }
}

const nextVideo = () => {
  emits('open-second-video')
  store.commit('video/SET_UPLOAD_CHECKBOXES', checkboxes.value)
}

const handleToggleHint = (id: number | null) => {
  activeHintId.value = id
}

watch(() => state.video.loadingFiles.video1_url, (newValue) => {
  loadingVideoOne.value = newValue
  visibleFirstVideo.value = 2
})

watch(() => state.video.errorVideo, () => {
  if (visibleFirstVideo.value === 0) {
    visibleFirstVideo.value = 1
    loadingVideoOne.value = false
    loadingBlockVideoOne.value = false
    fileUploaded.value = null
  }
})

const isMobile = ref(false)

onMounted(() => {
  const userAgent = navigator.userAgent.toLowerCase()
  isMobile.value = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

  if (props.visibleFirst === false) {
    visibleFirstVideo.value = 2
  }

  if (state.video.uploadCheckboxes) {
    checkboxes.value = state.video.uploadCheckboxes
  }
})

window.addEventListener('beforeunload', e => {
  console.log(urlFirstVideo.value)
  if(urlFirstVideo.value) {
    e.preventDefault()
    e.returnValue = ''
  }
})

window.addEventListener('pagehide', () => {
  if (urlFirstVideo.value) {
    if (confirm('Изменения могут не сохраниться.')) {
      emits('download-new-video')
    }
  }
})

</script>

<style scoped lang="scss">
@import "firstVideoUpload";
</style>