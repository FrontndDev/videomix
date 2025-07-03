import * as API from '@/api/index'
import { Commit } from "vuex";
import { useShowMessage } from "@/composables/useShowMessage.ts";

export default {
  namespaced: true,
  state: {
    uploadCheckboxes: null as Array<any> | null,
    stateVideoProcessing: {
      video1_url: '',
      video2_url: '',
      image_url: '',
    },
    loadingFiles: {
      video1_url: null,
      video2_url: null,
      image_url: null,
    },
    intervalId: {},
    taskInfo: '',
    taskId: [],
    urlDownloadVideo: '',
    dataVideoProcess: null,
    copyData: [],
    copyProcessing: null,
    error: '',
    errorVideo: null,
    counter: 0,
    loadingFinalVideo: false,
    statusFailure: false,
    newWidthVideo: <number | null>(null),
    newWidthStickerState: <number | null>(null),
    actualWidthVideo: <number | null>(null),
    actualHeightVideo: <number | null>(null),
  },
  actions: {
    downloadFile(
        { commit }: { commit: Commit },
        { file, type, key }: { file: any, type: string, key: String }
    ) {
      API.downloadFile(file, type).then(response => {
        if(response) {
          commit('SET_VIDEO_URL', { key, url: response.data.url })
        }
      })
    },
    videoProcessing(
        { commit, dispatch, state }: { commit: Commit, dispatch: any, state: any },
        data: Object
    ) {
      if (state.urlDownloadVideo) {
        state.counter++
      }

      if (state.counter <= 10) {
        API.videoProcessing(data).then(response => {

          const taskId = response.data.task_id

          if (response) {
            state.taskId.push(taskId)
            state.dataVideoProcess = data

            const intervalId = setInterval(() => {
              dispatch('getInfoTask', taskId)
            }, 5000)

            commit('SET_INTERVAL_ID', { intervalId, taskId })
          }
        })
      } else {
        useShowMessage('red', 'Вы можете сгенерировать не более 10 копий видео', 'Ошибка:')
      }
    },
    getInfoTask({commit, state}: { commit: Commit, state: any }, id: String) {
      API.getInfoTask(id).then(response => {
        if (!id) {
          useShowMessage('red', 'id: undefined', 'Ошибка:')
          commit('CLEAR_INTERVAL', id)
          state.statusFailure = !state.statusFailure
        } else {
          if (response?.data.status === 'FAILURE') {
            commit('CLEAR_INTERVAL', id)
            state.statusFailure = !state.statusFailure
            useShowMessage('red', response.data.error, 'Ошибка:')
          }

          if (state.urlDownloadVideo) {
            if(response?.data.url) {
              state.copyData.push({ url: response.data.url })
              state.copyProcessing = false
              commit('CLEAR_INTERVAL', id)
            }
          } else {
            if (response) {
              state.taskInfo = response.data.info
            }

            if (response?.data.url) {
              state.urlDownloadVideo = response.data.url
              state.loadingFinalVideo = true
              commit('CLEAR_INTERVAL', id)
            }

            if (response?.error_message) {
              state.error = response.error_message
              console.log(state.error)
            }
          }
        }
      })
    },
  },
  mutations: {
    SET_UPLOAD_CHECKBOXES(state: any, checkboxes: Array<any> | null) {
      state.uploadCheckboxes = checkboxes
    },
    SET_VIDEO_URL(state: any, { key, url }: { key: string, url: string }) {
      if (state.stateVideoProcessing.hasOwnProperty(key)) {
        state.stateVideoProcessing[key] = url
        state.loadingFiles[key] = false
      }
    },
    CLEAR_LOADING_FILES(state: any, key: string) {
      state.loadingFiles[key] = null
    },
    START_COPY(state: any) {
      state.copyProcessing = true
    },
    SET_ERROR(state: any, error: string) {
      state.errorVideo = error
    },
    SET_INTERVAL_ID(state: any, { intervalId, taskId }: { intervalId: number, taskId: any }) {
      state.intervalId[taskId] = intervalId
    },
    CLEAR_INTERVAL(state: any, taskId: any) {
      if (taskId === 'full') {
        for (const key in state.intervalId) {
          clearInterval(state.intervalId[key])
          delete state.intervalId[key]
        }
      } else {
        clearInterval(state.intervalId[taskId])
        delete state.intervalId[taskId]
      }
    },
    UPDATE_NEW_WIDTH_VIDEO(state: any, width: number) {
      state.newWidthVideo = width
    },
    UPDATE_NEW_WIDTH_STICKER(state: any, width: number) {
      state.newWidthStickerState = width
    }
  }
}
