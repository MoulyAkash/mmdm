// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import styled from 'styled-components';
import { AiFillPlayCircle } from 'react-icons/ai';

import anilistApi from '../api/anilistApi';

const AnimeList = (props) => {

    const variables = {
        page: 1,
        perPage: 20,
        genre: props.genre
    }

    const [animeItems, setAnimeItems] = useState([]);

    useEffect(() => {
        const getAnimeList = async () => {
            const response = await anilistApi.getSimilar(variables);
            setAnimeItems(response.Page.media);
        }
        getAnimeList();
    }, [])

    return (
        <Splide options={{
            fixedWidth: '14rem',
            pagination: false,
            arrows: false,
            drag: 'free',
            gap: '2rem'

        }}>
            {
                animeItems.filter((item) => (item.id !== props.id)).map((item, i) => {
                    const link = '/anime/' + props.category + '/' + item.id;

                    return (
                        <StyledSplideSlide key={i}>
                            <NavLink to={link}>
                                <SCard>
                                    <img src={item.coverImage.extraLarge} alt={item.title.english || item.title.romaji || item.title.native} />
                                    <div><AiFillPlayCircle /></div>
                                </SCard>
                                <CardTitle>{item.title.english || item.title.romaji || item.title.native}</CardTitle>
                            </NavLink>
                        </StyledSplideSlide>
                    );
                })
            }
        </Splide>
    );
};

AnimeList.propTypes = {
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
}

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

  img{
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
    background-color: #1F1F1F;
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

export default AnimeList;