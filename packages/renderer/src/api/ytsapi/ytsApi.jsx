// @ts-nocheck
import ytsAxiosClient from "./ytsAxiosClient";

const ytsApi = {
  getYTSMovieMagnets: (params) => {
    return ytsAxiosClient.get("", params);
  },
};

export default ytsApi;
