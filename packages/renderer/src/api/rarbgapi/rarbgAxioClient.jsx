import axios from "axios";
import queryString from "query-string";

import rarbgApiConfig from "./rarbgApiConfig";

const rarbgAxiosClient = axios.create({
  baseURL: rarbgApiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  },
  paramsSerializer: (params) => queryString.stringify({ ...params }),
});

rarbgAxiosClient.interceptors.request.use(async (config) => config);

rarbgAxiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    throw error;
  }
);

export default rarbgAxiosClient;
