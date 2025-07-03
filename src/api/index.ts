import {getAsync, postAsync} from "@/api/config";

// ******GET***********

export async function getInfoTask(id: String) {
    return getAsync(`/api/video-mix/check/${id}`, null)
}

// ******POST***********

export async function downloadFile(file: any, type: String) {
    return postAsync(`/api/video-mix/upload/${type}`, { file }, true)
}

export async function videoProcessing(data: any) {
    return postAsync('/api/video-mix/process', data, false)
}