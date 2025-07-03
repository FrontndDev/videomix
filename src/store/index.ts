import { createStore } from 'vuex';
import video from "@/store/modules/videos";
import notifications from "@/store/modules/notifications";

export default createStore({
  modules: {
    video,
    notifications
  }
})