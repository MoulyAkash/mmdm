import axios from "axios";
import queryString from "query-string";

import ytsApiConfig from "./ytsApiConfig";

const ytsAxiosClient = axios.create({
  baseURL: ytsApiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify({ ...params }),
});

ytsAxiosClient.interceptors.request.use(async (config) => config);

ytsAxiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data.data.movie;
    }

    return response;
  },
  (error) => {
    throw error;
  }
);

export default ytsAxiosClient;
