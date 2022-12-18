// @ts-nocheck
import React, { useState, useEffect, useContext } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";

import tmdbApi from "../../api/tmdbApi";
import rarbgApi from "../../api/rarbgapi/rarbgApi";
import apiConfig from "../../api/apiConfig";
import getTMDB from "../../modules/fetchMovieMagnets";
import { add } from "../../modules/torrent";

import "./details.scss";
import CastList from "./CastList";
import VideoList from "./VideoList";
import MovieList from "../../components/movie-list/MovieList";

import { LibraryContext } from "../../GlobalContext";
import { w2gContext } from "../../GlobalContext";

const Details = () => {
  const navigate = useNavigate();
  const { library, setLibrary } = useContext(LibraryContext);
  const { w2gEnabled, setW2gEnabled } = useContext(w2gContext);
  const [isPresentInLibrary, setIsPresentInLibrary] = useState(false);

  const { category, id, name } = useParams();

  const [item, setItem] = useState(null);

  const [rarbgItems, setRarbgItems] = useState([]);

  useEffect(() => {
    const getDetail = async () => {
      const response = await tmdbApi.detail(category, id, { params: {} });
      setItem(response);
      console.log(response);
    };
    getDetail();
  }, []);

  const getTMDBMagnets = async (id) => {
    // const response = await getTMDB(id, category);
    // const response = await getTMDB(name, "test");
    const response = await rarbgApi.getTMDBTorrents(id);
    setRarbgItems(response.torrent_results);
    console.log(response.torrent_results);
  };

  useEffect(() => {
    checkPresenceInLibrary();
    item && getTMDBMagnets(item.id);
  }, [item]);

  useEffect(() => {
    if (rarbgItems != null) {
      for (let i = 0; i < rarbgItems.length; i++) {
        if (
          !rarbgItems[i]?.filename?.includes("DTC") &&
          !rarbgItems[i]?.filename?.includes("REMUX") &&
          !rarbgItems[i]?.filename?.includes("2160p") &&
          !rarbgItems[i]?.filename?.includes("4K") &&
          !rarbgItems[i]?.filename?.includes("HEVC") &&
          !rarbgItems[i]?.filename?.includes("DTS") &&
          !rarbgItems[i]?.filename?.includes("H.265") &&
          !rarbgItems[i]?.filename?.includes("EAC3") &&
          !rarbgItems[i]?.filename?.includes("DDP5") &&
          !rarbgItems[i]?.filename?.includes("DDP") &&
          !rarbgItems[i]?.filename?.includes("Atmos") &&
          !rarbgItems[i]?.filename?.includes("ATMOS") &&
          !rarbgItems[i]?.filename?.includes("CAKES") &&
          !rarbgItems[i]?.filename?.includes("x265") &&
          !rarbgItems[i]?.filename?.includes("X265") &&
          rarbgItems[i]?.filename?.includes("1080p")
        ) {
          add(rarbgItems[i].download || rarbgItems[i].magnet);
          if (w2gEnabled === "host") {
            document.dispatchEvent(
              new CustomEvent("w2gInit", {
                detail: {
                  type: "addTorrent",
                  torrent: rarbgItems[i].download || rarbgItems[i].magnet,
                },
              })
            );
          }
          break;
        }
      }
    }
  }, [rarbgItems]);

  const addToLibrary = () => {
    for (let i = 0; i < library.length; i++) {
      if (library[i].id === item.id) return;
    }
    library.push({ ...item, category });
    console.log("Current library: ", library);
    setIsPresentInLibrary(true);
  };

  const removeFromLibrary = () => {
    for (let i = 0; i < library.length; i++) {
      if (library[i].id === item.id) {
        library.splice(i, 1);
        return;
      }
    }
    console.log("Current library: ", library);
    setIsPresentInLibrary(false);
  };

  const checkPresenceInLibrary = () => {
    if (item === null) return;
    for (let i = 0; i < library.length; i++) {
      if (library[i].id === item.id) {
        console.log("Here");
        setIsPresentInLibrary(true);
        return;
      }
    }
    setIsPresentInLibrary(false);
  };

  return (
    <>
      {item && (
        <>
          <div
            className="banner"
            style={{
              backgroundImage: `url(${apiConfig.originalImage(
                item.backdrop_path || item.poster_path
              )})`,
            }}
          ></div>
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
            <button
              className="genres__item"
              onClick={() => {
                if (w2gEnabled === "host") {
                  document.dispatchEvent(
                    new CustomEvent("w2gInit", {
                      detail: {
                        type: "watchNow",
                        path: "/player/" + category + "/" + item.id,
                      },
                    })
                  );
                }
                navigate("/player/" + category + "/" + item.id);
              }}
            >
              Watch Now
            </button>
            {isPresentInLibrary ? (
              <button
                className="genres__item"
                onClick={() => removeFromLibrary()}
                style={{ marginLeft: 20 }}
              >
                Remove from Library
              </button>
            ) : (
              <button
                className="genres__item"
                onClick={() => addToLibrary()}
                style={{ marginLeft: 20 }}
              >
                Add to Library
              </button>
            )}
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
};

const SNavLink = styled(NavLink)``;

export default Details;
