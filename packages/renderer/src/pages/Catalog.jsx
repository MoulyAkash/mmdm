// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import PageHeader from '../components/page-header/PageHeader';
import { category as cate } from '../api/tmdbApi';
import MovieGrid from '../components/movie-grid/MovieGrid';
import CarouselSlide from '../components/CarouselSlide';

const Catalog = () => {

  const { category } = useParams();

  return (
    <>
      {/* <PageHeader>
        {category === cate.movie ? 'Movies' : 'TV Series'}
      </PageHeader> */}
      <CarouselSlide />
      <MainContainer>
        <MovieGrid category={category} />
      </MainContainer>
    </>
  );
};


const MainContainer = styled.div`
  padding: 2rem;
  padding-top: 3rem;
`;

export default Catalog;