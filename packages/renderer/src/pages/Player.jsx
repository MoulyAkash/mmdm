// @ts-nocheck
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, NavLink } from "react-router-dom";
import screenfull from "screenfull";
import ReactPlayer from "react-player";

import {
  MdReplay10,
  MdPlayArrow,
  MdForward10,
  MdVolumeUp,
  MdSettings,
  MdPictureInPictureAlt,
  MdFullscreen,
  MdPause,
  MdVolumeOff,
  MdClosedCaption,
  MdClosedCaptionDisabled,
} from "react-icons/md";

import "./player.css";
import "../pages/detail/details.scss";
import CastList from "./detail/CastList";
import VideoList from "./detail/VideoList";
import MovieList from "../components/movie-list/MovieList";

import tmdbApi from "../api/tmdbApi";
import apiConfig from "../api/apiConfig";

import { client } from "../modules/torrent";
import { set } from "../pages/Settings";

export let media = null;
let fileMedia = null;
let hadImage = false;

import Peer from "../modules/Peer";
import Subtitles from "../modules/subtitles";
import { toTS, videoRx, fastPrettyBytes } from "../modules/util.js";

export let miniplayer = false;
export let page;
// export let files = JSON.parse(localStorage.getItem('files')) || [];

const torrent = {};
export function updateStats(detail) {
  // console.log('Update stats called')
  torrent.peers = detail.numPeers || 0;
  torrent.up = detail.uploadSpeed || 0;
  torrent.down = detail.downloadSpeed || 0;
}

let imageData = null;

export function handlePieces(detail) {
  // Handling pieces
  if (detail.constructor === Array) {
    if (imageData) {
      for (let i = 0; i < detail.length; ++i) {
        imageData.data[i * 4 + 3] = detail[i];
      }
      // ctx.putImageData(imageData, 0, 0)
    }
  } else {
    const uint32 = new Uint32Array(detail);
    uint32.fill(872415231); // rgba(255, 255, 255, 0.2) to HEX to DEC
    imageData = new ImageData(new Uint8ClampedArray(uint32.buffer), detail, 1);
  }
}

export function updateMedia(fileMed) {
  fileMedia = fileMed;
  media = fileMedia.media;
  const name = [
    fileMedia.mediaTitle,
    fileMedia.episodeNumber,
    fileMedia.episodeTitle,
    "Miru",
  ]
    .filter((i) => i)
    .join(" - ");
  // setTitle(name);

  fileMedia.episodeThumbnail = !!fileMedia.episodeThumbnail;
  const metadata =
    fileMedia.episodeThumbnail || fileMedia.mediaCover
      ? new MediaMetadata({
          title: name,
          artwork: [
            {
              src: fileMedia.episodeThumbnail || fileMedia.mediaCover,
              sizes: "256x256",
              type: "image/jpg",
            },
          ],
        })
      : new MediaMetadata({ title: name });
  if (fileMedia.parseObject?.release_group)
    metadata.artist = fileMedia.parseObject.release_group;
  navigator.mediaSession.metadata = metadata;
}

// let src = null
let video = null;
let current = null;
export let subs = null;
let duration = 0.1;
let videos = [];
let subHeaders = null;
let volume = localStorage.getItem("volume") || 1;

function Player(props) {
  const { category, id } = useParams();

  const [item, setItem] = useState(null);

  const [src, setSrc] = useState("");
  const [filePath, setFilePath] = useState("");

  const [files, setFiles] = useState([]);

  function updateFiles(files) {
    if (files?.length) {
      videos = files.filter((file) => videoRx.test(file.name));
      if (videos?.length) {
        handleCurrent(videos[0]);
        if (subs) {
          subs.files = files || [];
          subs.findSubtitleFiles(current);
        }
      }
    } else {
      media = null;
      fileMedia = null;
      hadImage = false;
      // src = ''
      setSrc("");
      setFilePath("");
      video?.load();
      currentTime = 0;
    }
  }

  async function handleCurrent(file) {
    console.log("handleCurrent triggered");
    console.log(file);
    if (file) {
      currentTime = 0;
      media = null;
      fileMedia = null;
      hadImage = false;
      current = file;
      // initSubs();
      // src = file.url
      setSrc(file.url);
      setFilePath(file.path);
      console.log("File: " + file);
      client.send("current", file);
      video?.load();
    }
  }

  function handleHeaders() {
    subHeaders = subs?.headers;
  }

  function initSubs() {
    if (subs) subs.destroy();
    subs = new Subtitles(playerRef, files, current, handleHeaders);
  }

  let currentTime = 0;

  const [isPaused, setIsPaused] = useState(false);

  const [isMuted, setIsMuted] = useState(false);

  const [isPip, setIsPip] = useState(false);

  const [volume, setVolume] = useState(1);

  const [isSettingsActive, setIsSettingsActive] = useState(false);

  const [videoDuration, setVideoDuration] = useState("00:00:00");

  const [presentTime, setPresentTime] = useState("00:00:00");

  const [played, setPlayed] = useState(0);

  const [playbackRate, setPlaybackRate] = useState(1);

  const playBackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2];

  const [isCaptionsEnabled, setCaptionsEnabled] = useState(false);

  const playerRef = useRef(null);

  const playerContainerRef = useRef(null);

  const volumeSliderRef = useRef(null);

  const progressBarRef = useRef(null);

  const controlsRef = useRef(null);

  // const progressBarRef = useRef(null);

  useEffect(() => {
    setFiles(JSON.parse(localStorage.getItem("files")) || []);

    // if(screenfull.isFullscreen) {
    //   console.log('screen full');
    // }

    const getDetail = async () => {
      const response = await tmdbApi.detail(category, id, { params: {} });
      setItem(response);
    };

    getDetail();
  }, []);

  useEffect(() => {
    updateFiles(files);
  }, [files]);

  useEffect(() => {
    navigator.mediaSession.setPositionState({
      duration: Math.max(0, duration || 0),
      playbackRate: 1,
      position: Math.max(0, Math.min(duration || 0, currentTime || 0)),
    });
  }, [navigator.mediaSession]);

  console.log("Source = ");
  console.log(src);
  console.log("Path: " + filePath);

  const handleRewind = () => {
    console.log(playerRef.current.getCurrentTime());
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const onVolumeChange = () => {
    setVolume(Math.floor(volumeSliderRef.current.value) / 100);
    if (volume < 0.05) setIsMuted(true);
    else setIsMuted(false);
  };

  const onProgressBarChange = () => {
    playerRef.current.seekTo(
      Math.floor(progressBarRef.current.value) / 100,
      "fraction"
    );
  };

  const handleMute = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted);
    if (isMuted) setVolume(1);
    else setVolume(0);
  };

  const handleDuration = (duration) => {
    let fordur = new Date(duration * 1000).toISOString().substr(11, 8);
    setVideoDuration(fordur);
  };

  const handleProgress = (callbackValues) => {
    let playedSeconds = new Date(callbackValues.playedSeconds * 1000)
      .toISOString()
      .substr(11, 8);
    setPresentTime(playedSeconds);
    setPlayed(callbackValues.played);
  };

  return (
    <>
      <div className="container-main">
        <div className="c-video" id="video_player" ref={playerContainerRef}>
          <ReactPlayer //figure out a way to use Native HTML5 player
            className="main-video"
            ref={playerRef}
            url={src}
            // url='https://www.youtube.com/watch?v=DsZAFD5Y0sM'
            playing={isPaused}
            muted={isMuted}
            pip={isPip}
            controls={false}
            volume={volume}
            onDisablePIP={() => setIsPip(false)}
            onDuration={handleDuration}
            playbackRate={playbackRate}
            onProgress={handleProgress}
            progressInterval={500}
            height="100%"
            width="100%"
            onClick={() => {
              setIsPaused((prevIsPaused) => !prevIsPaused);
              console.log(subs);
            }}
          />
          <div ref={controlsRef} className="controls">
            <div className="progress-area">
              {/* <div className="progress-bar" style={{width: {played}*100}}>
                <span></span>
              </div> */}
              <input
                ref={progressBarRef}
                type="range"
                min="0"
                max="100"
                value={played * 100}
                step="0.01"
                className="progress-bar-slider"
                onChange={onProgressBarChange}
              />
            </div>

            <div className="controls-list">
              <div className="controls-left">
                <span className="icon">
                  <MdReplay10
                    className="material-icons fast-rewind"
                    onClick={handleRewind}
                  >
                    replay_10
                  </MdReplay10>
                </span>

                <span className="icon">
                  {isPaused ? (
                    <MdPause
                      className="material-icons play_pause"
                      onClick={() =>
                        setIsPaused((prevIsPaused) => !prevIsPaused)
                      }
                    >
                      play_arrow
                    </MdPause>
                  ) : (
                    <MdPlayArrow
                      className="material-icons play_pause"
                      onClick={() =>
                        setIsPaused((prevIsPaused) => !prevIsPaused)
                      }
                    >
                      play_arrow
                    </MdPlayArrow>
                  )}
                </span>

                <span className="icon">
                  <MdForward10
                    className="material-icons fast-forward"
                    onClick={handleForward}
                  >
                    forward_10
                  </MdForward10>
                </span>

                <span className="icon">
                  {isMuted ? (
                    <MdVolumeOff
                      className="material-icons volume"
                      onClick={handleMute}
                    >
                      volume_up
                    </MdVolumeOff>
                  ) : (
                    <MdVolumeUp
                      className="material-icons volume"
                      onClick={handleMute}
                    >
                      volume_up
                    </MdVolumeUp>
                  )}

                  <input
                    ref={volumeSliderRef}
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    step="0.01"
                    className="volume_range"
                    onChange={onVolumeChange}
                  />
                </span>

                <div className="timer">
                  <span className="current">{presentTime}</span> /
                  <span className="duration">{videoDuration}</span>
                </div>
              </div>

              <div className="controls-right">
                {/* <span className="icon">
                  <i className="material-icons auto-play"></i>
                </span> */}

                <span className="icon">
                  {isCaptionsEnabled ? (
                    <MdClosedCaption
                      className="material-icons captionsBtn"
                      onClick={() => {
                        setCaptionsEnabled(!isCaptionsEnabled);
                      }}
                    >
                      closed_caption
                    </MdClosedCaption>
                  ) : (
                    <MdClosedCaptionDisabled
                      className="material-icons captionsBtn"
                      onClick={() => {
                        setCaptionsEnabled(!isCaptionsEnabled);
                      }}
                    >
                      closed_caption
                    </MdClosedCaptionDisabled>
                  )}
                </span>

                <span className="icon">
                  <MdSettings
                    className={`material-icons settingsBtn ${
                      isSettingsActive ? "active" : ""
                    }`}
                    onClick={() => {
                      setIsSettingsActive(!isSettingsActive);
                    }}
                  >
                    settings
                  </MdSettings>
                </span>

                <span className="icon">
                  <MdPictureInPictureAlt
                    className="material-icons picture_in_picutre"
                    onClick={() => setIsPip(true)}
                  >
                    picture_in_picture_alt
                  </MdPictureInPictureAlt>
                </span>

                <span className="icon">
                  <MdFullscreen
                    className="material-icons fullscreen"
                    onClick={() => {
                      screenfull.toggle(playerContainerRef.current);
                    }}
                  >
                    fullscreen
                  </MdFullscreen>
                </span>
              </div>
            </div>
          </div>
          <div id="settings" className={isSettingsActive ? "active" : ""}>
            <div className="playback">
              <span>Playback Speed</span>
              <ul>
                {playbackRate &&
                  playBackRates.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className={item === playbackRate ? "active" : ""}
                        onClick={() => {
                          setPlaybackRate(item);
                        }}
                      >
                        {item === 1 ? "Normal" : item}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div id="captions" className={isSettingsActive ? "active" : ""}>
            <div className="caption">
              <span>Select Subtitle</span>
              <ul></ul>
            </div>
          </div>
        </div>
      </div>
      {item && (
        <>
          <div className="banner"></div>
          <div className="movie-content container">
            <div className="movie-content__poster">
              <div
                className="movie-content__poster__img"
                style={{
                  backgroundImage: `url(${apiConfig.originalImage(
                    item.poster_path || item.backdrop_path
                  )})`,
                }}
              ></div>
            </div>
            <div className="movie-content__info">
              <h1 className="title">{item.title || item.name}</h1>
              <div className="genres">
                {item.genres &&
                  item.genres.slice(0, 5).map((genre, i) => {
                    return (
                      <span key={i} className="genres__item">
                        {genre.name}
                      </span>
                    );
                  })}
              </div>
              <p className="overview">{item.overview}</p>
              <div className="cast">
                <div className="section__header">
                  <h2>Casts</h2>
                </div>
                <CastList id={item.id} />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="section mb-3">
              <VideoList id={item.id} />
            </div>
            <div className="section mb-3">
              <div className="section__header mb-2">
                <h2>Similar</h2>
              </div>
              <MovieList category={category} type="similar" id={item.id} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Player;
