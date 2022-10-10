const rarbgApi = require('rarbg-api');
const TorrentSearchApi = require('torrent-search-api');

onmessage = async (e) => {

    if (e.data.type === 'fetchTMDBMagnet') {

        if (e.data.category === 'movie') {
            const result = await rarbgApi.search(e.data.data, null, 'themoviedb', {
                category: rarbgApi.CATEGORY.MOVIES_X264_1080P
            }).then(data => {
                return data;
            })

            postMessage({ result });
        }

        else if (e.data.category === 'tv') {
            const result = await rarbgApi.search(e.data.data, null, 'themoviedb', {
                category: rarbgApi.CATEGORY.TV_HD_EPISODES
            }).then(data => {
                return data;
            })

            postMessage({ result });
        }
    }
    else if (e.data.type === 'fetchTorrentsApiResults') {
        console.log('From movieMagnetWorker in test');

        console.log(TorrentSearchApi.getProviders());
        TorrentSearchApi.enablePublicProviders();

        const activeProviders = TorrentSearchApi.getActiveProviders();
        console.log(activeProviders);
        
        const result = await TorrentSearchApi.search(e.data.data);
        console.log(result);

        const magnet = await TorrentSearchApi.getMagnet(result[0]);
        console.log(magnet);

        postMessage({ result });
    }
    else {
        console.log('tf bro');
    }
}