// import WebTorrent from 'webtorrent'

import { set } from "@/pages/Settings";
// import { useFiles, setFiles, usePage, setPage } from '@/GlobalContext';
import { updateStats, handlePieces, subs } from "../pages/Player";

// A class that extends the normal Worker
class TorrentWorker extends Worker {
  constructor(opts) {
    super(opts);
    this.onmessage = this.handleMessage.bind(this);
  }

  handleMessage(e) {
    if (e.data.type === "subtitle") {
      // console.log(e);
      if(subs)
        subs.handleSubtitle(e.data.data);
    }
    if (e.data.type === "fonts") {
      // console.log(e);
      if(subs)
        subs.handleFonts();
    }
    if (e.data.type === "tracks") {
      // console.log(e);
      if(subs)
        subs.handleTracks(e.data.data);
    }
    if (e.data.type === "file") {
      // console.log(e);
      if(subs)
        subs.handleFile(e.data.data);
    }
    if (e.data.type === "torrent") {
      // console.log('Torrent event emitted');
      localStorage.setItem("torrent", JSON.stringify(e.data.data)); /// This is where the torrent file sets globally
    }

    if (e.data.type === "files") {
      // files.set(data.data)
      localStorage.setItem("files", JSON.stringify(e.data.data));
    }

    // console.log(localStorage.getItem('page'));
    if (localStorage.getItem("page") === "player") {
      if (e.data.type === "pieces") {
        // callHandlePieces(data.data);
        // console.log(data.data);
        handlePieces(e.data.data);
      }

      if (e.data.type == "stats") {
        // callUpdateStats(data.data);
        // console.log(data.data);
        updateStats(e.data.data);
      }
    }
  }

  send(type, data) {
    this.postMessage({ type, data });
  }
}

//Initializing worker with path to the worker, an export
export const client = new TorrentWorker(
  new URL("./torrentworker.js", import.meta.url)
);

//Sending settings to the torrent worker
client.send("settings", { ...set });

//Export function to add torrent
export async function add(torrentID, hide) {
  if (torrentID) {
    // setFiles([]);
    localStorage.setItem("files", JSON.stringify([]));
    if (!hide) localStorage.setItem("page", "player"); //setPage('player')
    if (typeof torrentID === "string" && !torrentID.startsWith("magnet:")) {
      // IMPORTANT, this is because node's get bypasses proxies, wut????
      const res = await fetch(torrentID);
      torrentID = Array.from(new Uint8Array(await res.arrayBuffer()));
    }

    // Sending the torrentID to worker
    client.send("torrent", torrentID);
  }
}

// load last used torrent
queueMicrotask(() => {
  if (localStorage.getItem("torrent")) {
    client.send("torrent", JSON.parse(localStorage.getItem("torrent")));
  }
});
