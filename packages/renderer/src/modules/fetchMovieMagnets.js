console.log("Making a rarbg worker from : ", (new URL('./rarbgworker.js', import.meta.url)));

export const worker = new Worker(new URL('./movieMagnetWorker.js', import.meta.url));

export default async function getTMDB(tmdbID, category) {

    let results

    if (category === 'movie' || category === 'tv') {
        results = new Promise((resolve, reject) => {

            worker.postMessage({
                type: 'fetchTMDBMagnet',
                category: category,
                data: tmdbID
            });

            worker.onmessage = (e) => {
                console.log('Message received from movieMagnetWorker.js for movie and tv');
                resolve(e.data.result);
            };
        });
    }
    
    else if (category === 'animemovie' || category === 'animetv') {

    }

    else if (category === 'test') {
        results = new Promise((resolve, reject) => {

            worker.postMessage({
                type: 'fetchTorrentsApiResults',
                category: category,
                data: tmdbID
            });

            worker.onmessage = (e) => {
                console.log('Test message received for torrentsApi');
                resolve(e.data.result);
            };
        });
    }

    return await results; // Should return a promise instead?
}