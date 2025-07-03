import axios, {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse
} from 'axios'

import store from "@/store";
import { useShowMessage } from "@/composables/useShowMessage.ts";

const __IS_DEV__ = import.meta.env.VITE_IS_DEV === 'true'

const devUrl = import.meta.env.VITE_DEV_URL ?? 'https://stage5.halk.ai' // 'https://stage2.halk.ai' 'https://dev.halk.ai'
const BASE_URL = __IS_DEV__ ? devUrl : window.location.origin;

const checkUserIsModer = (error: AxiosError) => {
    const errorData = (error.response as AxiosResponse).data

    //@ts-ignore
    if (window.UserData.moder) {
        useShowMessage('red', typeof errorData.error_message === 'string' ? errorData.error_message : errorData.user_message, 'Ошибка:')
    } else if (error?.response?.status !== 500) {
        useShowMessage('red', typeof errorData.error_message === 'string' ? errorData.error_message : errorData.user_message, 'Ошибка:')
    }

    console.error(error)
}

function setGlobalConfig() {

    function getCookie(name: string) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    const defaultSettings: AxiosRequestConfig["headers"] = {
        "Content-Type": "application/json",
        "x-auth": getCookie('dasdasdaddjdj'),
    };

    if (__IS_DEV__) {
        defaultSettings["x-auth"] = import.meta.env.VITE_X_AUTH
        defaultSettings["X-SPACE-ID"] = import.meta.env.VITE_X_SPACE_ID
    }

    return defaultSettings;
}

async function blockCatch(error: AxiosError) {
    checkUserIsModer(error)
    const response: AxiosResponse<any> | undefined = error.response;

    if (response) {
        console.error(response.data.user_message);
        store.commit('notifications/ERROR_CHANGE', response.data.user_message);
        store.commit('video/SET_ERROR', response);
    }

    if (response && response.status === 401) {
        console.error('Unauthorized');
    }
}

export async function postAsync(url: string, data: unknown, isFile: any) {

    const config: AxiosRequestConfig = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
            ...setGlobalConfig()
        }
    }

    config.headers = config.headers || {};

    isFile ? config.headers['Content-Type'] = "multipart/form-data" : config.headers['Content-Type'] = "application/json"

    try {
        let response = await axios.post(BASE_URL + url, data, config)

        if (response.status === 200 || response.status === 201 || response.status === 204) {
            return response.data
        }

    } catch (error) {
        blockCatch(error as AxiosError<unknown, any>)
    }

    return undefined
}

export async function getAsync(url: string, queryParams: any) {
    const config: AxiosRequestConfig = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
            ...setGlobalConfig(),
        },
        params: queryParams
    };

    try {
        let response = await axios.get(BASE_URL + url, config);
        if (response.status === 200 || response.status === 201) {
            return response.data;
        }
    } catch (error) {
        blockCatch(error as AxiosError);
    }
}

export async function deleteAsync(url: string) {
    const config: AxiosRequestConfig = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
    };

    try {
        let response = await axios.delete(BASE_URL + url, config);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        blockCatch(error as AxiosError);
    }
}

export async function putAsync(url: string, data: unknown) {

    const config: AxiosRequestConfig = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
    };

    try {
        let response = await axios.put(BASE_URL + url, data, config);

        if (response.status === 200 || response.status === 201 || response.status === 204) {
            return response.data;
        }

    } catch (error) {
        blockCatch(error as AxiosError);
    }

    return undefined;
}
