import {
    createRouter,
    createWebHistory
} from "vue-router";

import MainTemplate from "@/views/MainTemplate/MainTemplate.vue";


const baseUrl: string = '/app/video-mix'

const routes = [
    {
        path: baseUrl,
        children: [
            {
                path: ':type?',
                component: MainTemplate,
            },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export { baseUrl }
export default router