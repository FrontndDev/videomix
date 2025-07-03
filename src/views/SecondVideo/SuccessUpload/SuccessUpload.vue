<template>
  <div class="success-upload">
    <span class="success-upload__title">Второе видео успешно загружено</span>
    <div class="success-upload__buttons">
      <Button
          text="Продолжить"
          color="purple"
          @click="successUpload"
      />
      <Button
          text="Вернуться назад"
          color="white"
          @click="backUpload"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "@/components/UI/Button/Button.vue";

import { defineEmits } from 'vue'
import { useStore } from "vuex";

const store = useStore()

const emits = defineEmits([
    'back-upload',
    'success-upload'
])
const backUpload = () => {
  store.commit('video/CLEAR_LOADING_FILES', 'video2_url')
  emits('back-upload')
}

const successUpload = () => {
  emits('success-upload')
}

</script>

<style lang="scss" scoped>
@import "successUpload";
</style>