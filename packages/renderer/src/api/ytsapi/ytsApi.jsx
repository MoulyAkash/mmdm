// @ts-nocheck
import axiosClient from "./ytsAxiosClient";

const ytsApi = {
    getYTSMovieMagnets: (params) => {
        return axiosClient.get('', params);
    }
}

export default ytsApi;