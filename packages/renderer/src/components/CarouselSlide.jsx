// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import styled from 'styled-components';
import apiConfig from '../api/apiConfig';

import tmdbApi, { movieType } from '../api/tmdbApi'

function CarouselSlide() {

    const [movieItems, setMovieItems] = useState([]);

    useEffect(() => {
        const getMovies = async () => {
            const params = { page: 1 }
            try {
                const response = await tmdbApi.getMoviesList(movieType.popular, { params });
                setMovieItems(response.results.slice(0, 10));
            } catch {
                console.log('Error getting movie details for carousel');
            }
        }

        getMovies();
    }, []);

    if (!movieItems.length) {
        return null;
    }

    return (
        <SCarousel>
            {
                movieItems.map((item, i) => {

                    return (
                        <Carousel.Item key={i}>
                            <img
                                className="d-block w-100"
                                src={apiConfig.originalImage(item.backdrop_path)}
                                alt={'Slide #' + i}
                                style={{opacity: 0.8}}
                            />
                            <Carousel.Caption>
                                <h3>{item.original_title}</h3>
                                <p>{item.overview}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    )
                })
            }
        </SCarousel>
    )
}

const SCarousel = styled(Carousel)`
    height: 50vh;
    justify-content: center;
    align-items: center;
    img {
        object-fit: cover;
        width: 100%;
        height: 50vh;  
    }
`;


export default CarouselSlide