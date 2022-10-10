// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import anilistApi from '../../api/anilistApi';
import anilistApiConfig from '../../api/anilistApiConfig';

import './anime-details.scss';
import AnimeCharacterList from './AnimeCharacterList';
import AnimeVideoList from './AnimeVideoList';
import AnimeList from '../../components/AnimeList';

const AnimeDetails = () => {

  const { category, id } = useParams();

  const [animeItem, setAnimeItem] = useState(null);

  const variables = {id: id};

  let query = anilistApiConfig.detailsQuery;

  let url = anilistApiConfig.baseUrl;

  useEffect(() => {
    const getDetail = async () => {
      const response = await anilistApi.getDetails(variables);
      setAnimeItem(response.Media);
    }
    getDetail();
  }, [category, id]);

  console.log(animeItem);

  return (
    <>
      {
        animeItem && (
          <>
            <div className='banner' style={{ backgroundImage: `url(${animeItem.bannerImage})` }}></div>
            <div className="movie-content container">
              <div className="movie-content__poster">
                <div className="movie-content__poster__img" style={{ backgroundImage: `url(${animeItem.coverImage.extraLarge || animeItem.coverImage.large || animeItem.coverImage.medium})` }}></div>
              </div>
              <div className="movie-content__info">
                <h1 className="title">
                  {animeItem.title.english || animeItem.title.romaji || animeItem.title.native}
                </h1>
                <div className="genres">
                  {
                    animeItem.genres && animeItem.genres.slice(0, 5).map((genre, i) => {
                      return (
                        <span key={i} className='genres__item' >{genre}</span>
                      )
                    })
                  }
                </div>
                <p className='overview'>{animeItem.description.replace(/<\/?[^>]+(>|$)/g, "")}</p>
                <div className="cast">
                  <div className="section__header">
                    <h2>Characters</h2>
                  </div>
                  <AnimeCharacterList characters={animeItem.characters.nodes} />
                </div>
              </div>
            </div>
            <div className="container">
              <div className="section mb-3">
                {/* <AnimeVideoList vid={animeItem.trailer} /> */}
              </div>
              <div className="section mb-3">
                <div className="section__header mb-2">
                  <h2>Similar</h2>
                </div>
                <AnimeList category={category} type="similar" id={animeItem.id} genre={animeItem.genres}/>
              </div>
            </div>
          </>
        )
      }
    </>
  );
};

export default AnimeDetails;