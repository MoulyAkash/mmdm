// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import styled from 'styled-components';

import anilistApi from '../api/anilistApi';
import anilistApiConfig from '../api/anilistApiConfig';

function AnimeCarousel() {

    const [animeItems, setAnimeItems] = useState([]);
    const variables = { page: 1, perPage: 10 };

    useEffect(() => {
        const getAnimeItems = async () => {
            const response = await anilistApi.getSimilar(variables);
            setAnimeItems(response.Page.media);
        }
        getAnimeItems();
    }, []);

    return (
        <SCarousel>
            {
                animeItems.map((item, i) => {
                    
                    return (
                        <Carousel.Item key={i}>
                            <img
                                className="d-block w-100"
                                src={item.bannerImage}
                                alt={'Slide #' + i}
                                style={{opacity: 0.8}}
                            />
                            <Carousel.Caption>
                                <h3>{item.title.english}</h3>
                                <p>{item.description.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 600)}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    );
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

export default AnimeCarousel