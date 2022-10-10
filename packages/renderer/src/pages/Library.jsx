import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import styled from "styled-components";
// const rarbgApi = require('rarbg-api')

import apiConfig from "../api/apiConfig";
import InputSearch from "../components/input/InputSearch";

import "../components/movie-grid/movie-grid.scss"

import tmdbApi, { category, movieType } from "../api/tmdbApi";

import { AiFillPlayCircle } from "react-icons/ai";

import { LibraryContext } from "../GlobalContext";

function Library() {

  const { library, setLibrary } = useContext(LibraryContext);

  const [items, setItems] = useState([]);

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    setItems(library);
    console.log(library);
  }, []);

  useEffect(() => {
    makeSearch();
  }, [keyword]);

  const makeSearch = async () => {
    if (keyword === "") {
      setItems(library);
      return;
    }
    // setItems();
  };

  const removeFromLibrary = (item) => {
    for (let i = 0; i < library.length; i++) {
      if (library[i].id === item.id) {
        library.splice(i, 1);
        return;
      }
    }
    console.log("Current library: ", library);
    setIsPresentInLibrary(true);
  }

  return (
    <>
      <div style={{ height: "40%", width: "100%", textAlign: "center" }}>
        <p style={{ paddingTop: "8%", fontSize: 75 }}>Library</p>
      </div>
      <div style={{ padding: 40 }}>
        <div className="section mb-3">
          <div className="movie-search" style={{ paddingBottom: 20 }}>
            <InputSearch
              type="text"
              placeholder="Enter keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button className="search-button">Search</button>
          </div>
        </div>
        <div className="movie-grid">
          {items.map((item, i) => {
            const link =
              "/" +
              category[item.category] +
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
      </div>
    </>
  )
}

const SNavLink = styled(NavLink)`
  :hover {
    div {
      color: red;
    }
  }
`;

export default Library