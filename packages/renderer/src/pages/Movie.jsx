// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import CarouselSlide from '../components/CarouselSlide';
import MovieList from '../components/movie-list/MovieList';

import { category, movieType, tvType } from '../api/tmdbApi';

function Movie() {
  return (
    <>
      <CarouselSlide />
      <MainContainer>
        <h3 style={{paddingTop: 0}}>Popular</h3>
        <MovieList category={category.movie} type={movieType.popular} />
        <h3>Upcoming</h3>
        <MovieList category={category.movie} type={movieType.upcoming} />
        <h3>Top-Rated</h3>
        <MovieList category={category.movie} type={movieType.top_rated} />
      </MainContainer>
    </>
  )
}

const MainContainer = styled.div`
  padding: 2rem;
  h3 {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
`;

export default Movie