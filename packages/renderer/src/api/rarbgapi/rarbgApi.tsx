import rarbgAxiosClient from "./rarbgAxioClient";

let token = "";
let app_id = "";

function generateAppId() {
  var app_id = "";
  var str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 1; i <= 8; i++) {
    var index = Math.floor(Math.random() * str.length + 1);
    app_id += str.charAt(index);
  }
  return app_id;
}

export const category = {
  movie: "movie",
  tv: "tv",
};

export const movieType = {
  popular: "popular",
  upcoming: "upcoming",
  top_rated: "top_rated",
};

export const tvType = {
  popular: "popular",
  top_rated: "top_rated",
  on_the_air: "on_the_air",
};

async function getToken() {
  const response = await rarbgAxiosClient.get("", {
    params: {
      get_token: "get_token",
      app_id: app_id || generateAppId(),
    },
  });
  token = response?.token;
  return response?.token;
}

const rarbgApi = {
  getTMDBTorrents: async (tmdbID: string) => {
    await getToken();
    return rarbgAxiosClient.get("", {
      params: {
        token: token || (await getToken()),
        app_id: app_id || generateAppId(),
        mode: "search",
        search_themoviedb: tmdbID,
      },
    });
  },
};

export default rarbgApi;
