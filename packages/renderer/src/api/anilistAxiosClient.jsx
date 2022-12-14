// @ts-nocheck
import axios from "axios";
import queryString from 'query-string';

import anilistApiConfig from "./anilistApiConfig";

const axiosClient = axios.create({
    baseURL: anilistApiConfig.baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    data: {
        paramsSerializer: params => queryString.stringify(...params)
    }
})

axiosClient.interceptors.request.use(async (config) => config);

axiosClient.interceptors.response.use((response) => {
    
    if (response && response.data) {
        return response.data;
    }

    return response;
}, (error) => {
    throw error;
})

export default axiosClient;