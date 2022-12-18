// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { AiFillPlayCircle } from "react-icons/ai";

import apiConfig from "../../api/apiConfig";
import InputSearch from "../input/InputSearch";

import tmdbApi, { category, movieType } from "../../api/tmdbApi";

import "./movie-grid.scss";

const MovieGrid = (props) => {
  const [items, setItems] = useState([]);
  const [triggerGetList, setTriggerGetList] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const getList = async () => {
      let response = null;

      const params = {};
      switch (props.category) {
        case category.movie:
          response = await tmdbApi.getMoviesList(movieType.upcoming, {
            params,
          });
          break;
        default:
          response = await tmdbApi.getTvList(movieType.popular, { params });
          break;
      }
      setItems(response.results);
      setTotalPage(response.total_pages);
    };

    getList();

    setKeyword("");
  }, [props.category, triggerGetList]);

  useEffect(() => {
    if (keyword === "") {
      setTriggerGetList(!triggerGetList);
      setPage(1);
    }

    const enterEvent = (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        makeSearch();
      }
    };
    document.addEventListener("keyup", enterEvent);
    return () => {
      document.removeEventListener("keyup", enterEvent);
    };
  }, [keyword]);

  const makeSearch = async () => {
    let response = null;

    if (keyword === "") return;
    const params = {
      query: keyword,
    };
    response = await tmdbApi.search(props.category, { params });
    setItems(response.results);
    setTotalPage(response.total_pages);
  };

  const loadMore = async () => {
    let response = null;

    if (keyword === "") {
      const params = {
        page: page + 1,
      };
      switch (props.category) {
        case category.movie:
          response = await tmdbApi.getMoviesList(movieType.upcoming, {
            params,
          });
          break;
        default:
          response = await tmdbApi.getTvList(movieType.popular, { params });
          break;
      }
    } else {
      const params = {
        page: page + 1,
        query: keyword,
      };
      response = await tmdbApi.search(props.category, { params });
    }
    setItems([...items, ...response.results]);
    setPage(page + 1);
  };

  return (
    <>
      <div className="section mb-3">
        <div className="movie-search">
          <InputSearch
            type="text"
            placeholder="Enter keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="search-button" onClick={makeSearch}>
            Search
          </button>
        </div>
      </div>
      <div className="movie-grid">
        {items.map((item, i) => {
          const link =
            "/" +
              category[props.category] +
              "/" +
              item.id +
              "/" +
              item.original_title || item.original_name;

          return (
            <SNavLink to={link} key={i}>
              <div className="movie-card">
                <img
                  src={apiConfig.w500Image(item.poster_path)}
                  alt={item.original_title}
                />
                <div>
                  <AiFillPlayCircle />
                </div>
              </div>
              <div className="card-title">
                {item.original_title || item.original_name}
              </div>
            </SNavLink>
          );
        })}
      </div>
      <div className="btn-container">
        {/* {
          totalPage%20 === 0 ? (
            <button className='btn-container__loadmore' onClick={loadMore}>Load More</button>
          ) : null
        } */}
        <button className="btn-container__loadmore" onClick={loadMore}>
          Load More
        </button>
      </div>
    </>
  );
};

const SNavLink = styled(NavLink)`
  :hover {
    div {
      color: red;
    }
  }
`;

export default MovieGrid;
