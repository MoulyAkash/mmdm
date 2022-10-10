// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import styled from "styled-components";

import tmdbApi from "../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";
import getTMDB from "../../modules/fetchMovieMagnets";
import { add } from "../../modules/torrent";

import "./details.scss";
import CastList from "./CastList";
import VideoList from "./VideoList";
import MovieList from "../../components/movie-list/MovieList";

const Details = () => {
  const { category, id, name } = useParams();

  const [item, setItem] = useState(null);

  const [rarbgItems, setRarbgItems] = useState([]);

  useEffect(() => {
    const getDetail = async () => {
      const response = await tmdbApi.detail(category, id, { params: {} });
      setItem(response);
    };

    const getTMDBMagnets = async () => {
      const response = await getTMDB(id, category);
    //   const response = await getTMDB(name, "test");
      setRarbgItems(response);
    };

    getDetail();
    getTMDBMagnets();
  }, [category, id]);

  useEffect(() => {
    if (rarbgItems != null) {
      rarbgItems.sort(function (a, b) {
        return b.seeders - a.seeders;
      });
      for (let i = 0; i < rarbgItems.length; i++) {
        if (
          !rarbgItems[i].title.includes("DTC") &&
          !rarbgItems[i].title.includes("REMUX") &&
          !rarbgItems[i].title.includes("2160p") &&
          !rarbgItems[i].title.includes("4K") &&
          !rarbgItems[i].title.includes("HEVC") &&
          !rarbgItems[i].title.includes("DTS") &&
          !rarbgItems[i].title.includes("H.265") &&
          !rarbgItems[i].title.includes("EAC3") &&
          !rarbgItems[i].title.includes("DDP5") &&
          !rarbgItems[i].title.includes("DDP") &&
          !rarbgItems[i].title.includes("Atmos") &&
          !rarbgItems[i].title.includes("ATMOS") &&
          !rarbgItems[i].title.includes("CAKES") &&
          !rarbgItems[i].title.includes("x265") &&
          !rarbgItems[i].title.includes("X265")
        ) {
          add(rarbgItems[i].download || rarbgItems[i].magnet);
          //   add("magnet:?xt=urn:btih:4dc5ff0a9c6e74ff841c87d126e7790781cbe287&dn=%5BErai-raws%5D%20Spy%20x%20Family%20-%2001%20%5B1080p%5D%5BMultiple%20Subtitle%5D%5B24A04FB0%5D.mkv&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce");
          break;
        }
      }
    }
  }, [rarbgItems]);

  console.log(item);

  console.log(rarbgItems);

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
            <button className="genres__item">
              <NavLink to={"/player/" + category + "/" + item.id} item={item}>
                Watch Now
              </NavLink>
            </button>
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
