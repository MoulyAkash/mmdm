// @ts-nocheck
const apiConfig = {
    baseUrl: 'https://api.themoviedb.org/3/',
    apiKey: '095dd60b8978b299852afa840cc468b4',
    originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
    w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`

}

export default apiConfig;