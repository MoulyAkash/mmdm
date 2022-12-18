import React, { useContext, useState, useEffect } from "react";
import { add } from "../src/modules/torrent";
import App from "./App";

export const LibraryContext = React.createContext();
export const w2gContext = React.createContext();

let peerConnection: RTCPeerConnection;
let dataChannel: any;
let state = "";

function GlobalContext() {
  const [library, setUserLibrary] = useState([]);
  const [w2gEnabled, setUserW2gEnabled] = useState("false");

  const setLibrary = (library) => {
    setUserLibrary(library);
  };

  const setW2gEnabled = (state) => {
    setUserW2gEnabled(state);
  };

  useEffect(() => {
    document.addEventListener("w2gInit", handleEvent);
    return () => document.removeEventListener("w2gInit", handleEvent);
  }, []);

  function handleEvent(e: any) {
    if (e.detail.type === "createOffer") {
      state = "host";
      setW2gEnabled("host");
      peerConnection = createPeerConnection(lasticecandidate);
      dataChannel = peerConnection.createDataChannel("chat");
      dataChannel.onopen = datachannelopen;
      dataChannel.onmessage = datachannelmessage;
      let createOfferPromise = peerConnection.createOffer();
      createOfferPromise.then(createOfferDone, createOfferFailed);
    }
    if (e.detail.type === "answerPasted") {
      let answer = JSON.parse(atob(e.detail.text));
      console.log(answer);
      let setRemotePromise = peerConnection.setRemoteDescription(answer);
      setRemotePromise.then(setRemoteDone, setRemoteFailed);
    }
    if (e.detail.type === "offerPasted") {
      state = "client";
      setW2gEnabled("client");
      peerConnection = createPeerConnection(lasticecandidate);
      peerConnection.ondatachannel = handledatachannel;
      console.log(JSON.parse(atob(e.detail.text)));
      let offer = JSON.parse(atob(e.detail.text));
      let setRemotePromise = peerConnection.setRemoteDescription(offer);
      setRemotePromise.then(setRemoteDone, setRemoteFailed);
    }
    if (e.detail.type === "message") {
      dataChannel.send(
        JSON.stringify({
          type: "message",
          message: e.detail.text,
        })
      );
      chatlog(
        JSON.stringify({
          type: "message",
          message: e.detail.text,
        })
      );
    }
    if (e.detail.type === "addTorrent") {
      dataChannel.send(
        JSON.stringify({
          type: "addTorrent",
          torrent: e.detail.torrent,
        })
      );
    }
    if (e.detail.type === "watchNow") {
      dataChannel.send(
        JSON.stringify({
          type: "watchNow",
          path: e.detail.path,
        })
      );
    }
    if (e.detail.type === "pauseVideo") {
      dataChannel.send(
        JSON.stringify({
          type: "pauseVideo",
        })
      );
    }
    if (e.detail.type === "resumeVideo") {
      dataChannel.send(
        JSON.stringify({
          type: "resumeVideo",
        })
      );
    }
    if (e.detail.type === "setTime") {
      dataChannel.send(
        JSON.stringify({
          type: "setTime",
          time: e.detail.time,
          fraction: e.detail.fraction,
        })
      );
    }
  }

  function chatlog(msg: any) {
    let received = JSON.parse(msg);
    if (received.type === "message") {
      document.dispatchEvent(
        new CustomEvent("w2gEmitter", {
          detail: {
            type: "message",
            data: received.message,
          },
        })
      );
    }
    if (received.type === "error") {
      document.dispatchEvent(
        new CustomEvent("w2gEmitter", {
          detail: {
            type: "message",
            data: received.error,
          },
        })
      );
    }
    if (received.type === "connectionMessage") {
      document.dispatchEvent(
        new CustomEvent("w2gEmitter", {
          detail: {
            type: "message",
            data: received.message,
          },
        })
      );
    }
    if (received.type === "addTorrent") {
      add(received.torrent);
    }
    if (received.type === "watchNow") {
      document.dispatchEvent(
        new CustomEvent("navigate", {
          detail: {
            path: received.path,
          },
        })
      );
    }
    if (received.type === "pauseVideo") {
      document.dispatchEvent(
        new CustomEvent("w2gEmitter", {
          detail: {
            type: "pauseVideo",
          },
        })
      );
    }
    if (received.type === "resumeVideo") {
      document.dispatchEvent(
        new CustomEvent("w2gEmitter", {
          detail: {
            type: "resumeVideo",
          },
        })
      );
    }
    if (received.type === "setTime") {
      document.dispatchEvent(
        new CustomEvent("w2gEmitter", {
          detail: {
            type: "setTime",
            time: received.time,
            fraction: received.fraction,
          },
        })
      );
    }
  }

  function createPeerConnection(lasticecandidate: any) {
    let configuration = {
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
      ],
    };
    try {
      peerConnection = new RTCPeerConnection(configuration);
    } catch (err) {
      chatlog(
        JSON.stringify({
          type: "error",
          error: err,
        })
      );
    }
    peerConnection.onicecandidate = handleicecandidate(lasticecandidate);
    peerConnection.onconnectionstatechange = handleconnectionstatechange;
    peerConnection.oniceconnectionstatechange = handleiceconnectionstatechange;
    return peerConnection;
  }

  function handleicecandidate(lasticecandidate: any) {
    return function (event: any) {
      if (event.candidate != null) {
        console.log("new ice candidate");
      } else {
        console.log("all ice candidates");
        lasticecandidate();
      }
    };
  }

  function handleconnectionstatechange(event: any) {
    console.log("handleconnectionstatechange");
    console.log(event);
  }

  function handleiceconnectionstatechange(event: any) {
    console.log("ice connection state: " + event.target.iceConnectionState);
  }

  function datachannelopen() {
    console.log("datachannelopen");
    chatlog(
      JSON.stringify({
        type: "connectionMessage",
        message: "connected",
      })
    );
  }

  function datachannelmessage(message: any) {
    console.log("datachannelmessage");
    console.log(message);
    chatlog(message.data);
  }

  function createOfferDone(offer: any) {
    console.log("createOfferDone");
    let setLocalPromise = peerConnection.setLocalDescription(offer);
    setLocalPromise.then(setLocalDone, setLocalFailed);
  }

  function createOfferFailed(reason: any) {
    console.log("createOfferFailed");
    console.log(reason);
  }

  function createAnswerDone(answer: any) {
    console.log("createAnswerDone");
    let setLocalPromise = peerConnection.setLocalDescription(answer);
    setLocalPromise.then(setLocalDone, setLocalFailed);
  }

  function createAnswerFailed(reason: any) {
    console.log("createAnswerFailed");
    console.log(reason);
  }

  function setLocalDone() {
    console.log("setLocalDone");
  }

  function setLocalFailed(reason: any) {
    console.log("setLocalFailed");
    console.log(reason);
  }

  function lasticecandidate() {
    console.log("lasticecandidate");
    if (state === "host") {
      let offer = peerConnection.localDescription;
      console.log(JSON.stringify(offer));
      document.dispatchEvent(
        new CustomEvent("w2gEmitter", {
          detail: {
            type: "lastIceCandidate",
            state: "host",
            offer: btoa(JSON.stringify(offer)),
          },
        })
      );
    } else if (state === "client") {
      let answer = peerConnection.localDescription;
      console.log(JSON.stringify(answer));
      document.dispatchEvent(
        new CustomEvent("w2gEmitter", {
          detail: {
            type: "lastIceCandidate",
            state: "client",
            answer: btoa(JSON.stringify(answer)),
          },
        })
      );
    }
  }

  function handledatachannel(event: any) {
    console.log("handledatachannel");
    dataChannel = event.channel;
    dataChannel.onopen = datachannelopen;
    dataChannel.onmessage = datachannelmessage;
  }

  function setRemoteDone() {
    console.log("setRemoteDone");
    if (state === "client") {
      let createAnswerPromise = peerConnection.createAnswer();
      createAnswerPromise.then(createAnswerDone, createAnswerFailed);
    }
  }

  function setRemoteFailed(reason: any) {
    console.log("setRemoteFailed");
    console.log(reason);
  }

  return (
    <LibraryContext.Provider value={{ library, setLibrary }}>
      <w2gContext.Provider value={{ w2gEnabled, setW2gEnabled }}>
        <App />
      </w2gContext.Provider>
    </LibraryContext.Provider>
  );
}

export default GlobalContext;
