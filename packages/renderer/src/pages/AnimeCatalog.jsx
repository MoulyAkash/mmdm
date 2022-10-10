// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import AnimeGrid from '../components/anime-grid/AnimeGrid';
import AnimeCarousel from '../components/AnimeCarousel';

const AnimeCatalog = () => {

    const { category } = useParams();

    return (
        <>
            <AnimeCarousel />
            <MainContainer>
                <AnimeGrid category={category} />
            </MainContainer>
        </>
    );
};

const MainContainer = styled.div`
  padding: 2rem;
  padding-top: 3rem;
`;

export default AnimeCatalog;