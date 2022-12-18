// @ts-nocheck
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import styled from "styled-components";
import { AiFillPlayCircle } from "react-icons/ai";

import tmdbApi, { category } from "../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";

const MovieList = (props) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getList = async () => {
      let response = null;
      const params = {};
      if (props.type !== "similar") {
        switch (props.category) {
          case category.movie:
            response = await tmdbApi.getMoviesList(props.type, { params });
            break;
          default:
            response = await tmdbApi.getTvList(props.type, { params });
            break;
        }
      } else {
        response = await tmdbApi.similar(props.category, props.id);
      }
      setItems(response.results);
    };

    getList();
  }, [props.category, props.id]);

  return (
    <Splide
      options={{
        fixedWidth: "14rem",
        pagination: false,
        arrows: false,
        drag: "free",
        gap: "2rem",
      }}
    >
      {items
        .filter((item) => item.id !== props.id)
        .map((item, i) => {
          const link =
            "/" + category[props.category] + "/" + item.id + "/" + item.name;

          return (
            <StyledSplideSlide key={i}>
              <NavLink to={link}>
                <SCard>
                  <img
                    src={apiConfig.w500Image(item.poster_path)}
                    alt={item.original_title}
                  />
                  <div>
                    <AiFillPlayCircle />
                  </div>
                </SCard>
                <CardTitle>{item.original_title}</CardTitle>
              </NavLink>
            </StyledSplideSlide>
          );
        })}
    </Splide>
  );
};

MovieList.propTypes = {
  category: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

const StyledSplideSlide = styled(SplideSlide)`
  cursor: pointer;

  :hover {
    div {
      color: red;
    }
  }
`;

const SCard = styled.div`
  min-height: 25rem;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  transition-timing-function: ease;

  img {
    border-radius: 1rem;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  div {
    position: absolute;
    display: flex;
    width: 80px;
    height: 80px;
    justify-content: center;
    align-items: center;
    color: red;
    background-color: #1f1f1f;
    border-radius: 50%;
    font-size: 45px;
    visibility: hidden;
  }

  :hover {
    box-shadow: 0 0 20px red;

    img {
      opacity: 0.4;
    }

    div {
      visibility: visible;
      animation: grow 1s infinite;
    }
  }
`;

const CardTitle = styled.div`
  padding-top: 10px;
  font-size: 1rem;
  font-weight: 600;
  color: #d9d9d9;
`;

export default MovieList;
