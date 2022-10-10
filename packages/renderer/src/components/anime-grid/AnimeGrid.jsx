// @ts-nocheck
import { useState, useEffect, useCallback } from 'react'
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { AiFillPlayCircle } from 'react-icons/ai';

import anilistApi from '../../api/anilistApi';
import InputSearch from '../input/InputSearch';

import './anime-grid.scss';

const AnimeGrid = (props) => {

  const [items, setItems] = useState([]);
  const [triggerGetList, setTriggerGetList] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const getList = async () => {
      let response = null;

      const variables = { search: '', page: 1, perPage: 20 };
      switch (props.category) {
        case 'movie':
          response = await anilistApi.getMoviesList(variables);
          break;
        default:
          response = await anilistApi.getTvList(variables);
          break;
      }
      setItems(response.media);
      setTotalPage(response.pageInfo.total);
    }

    getList();

    setKeyword('');
  }, [props.category, triggerGetList]);

  useEffect(() => {

    if (keyword === '') {
      setTriggerGetList(!triggerGetList);
      setPage(1);
    }

    const enterEvent = (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        makeSearch();
      }
    }
    document.addEventListener('keyup', enterEvent);
    return () => {
      document.removeEventListener('keyup', enterEvent);
    };

  }, [keyword]);

  const makeSearch = async () => {
    let response = null;

    if (keyword === '')
      return;

    const variables = { search: keyword, page: 1, perPage: 20 }

    switch (props.category) {
      case 'movie':
        response = await anilistApi.getMoviesList(variables);
        break;
      default:
        response = await anilistApi.getTvList(variables);
        break;
    }
    setItems(response.media);
    setTotalPage(response.pageInfo.total);
  }

  const loadMore = async () => {
    let response = null;

    let variables;

    if (keyword === '')
      variables = { search: '', page: page + 1, perPage: 20 };
    else
      variables = { search: keyword, page: page + 1, perPage: 20 };

    switch (props.category) {
      case 'movie':
        response = await anilistApi.getMoviesList(variables);
        break;
      default:
        response = await anilistApi.getTvList(variables);
        break;
    }

    setItems([...items, ...response.media]);
    setPage(page + 1);
  }

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
          <button className='search-button'>Search</button>
        </div>
      </div>
      <div className='movie-grid'>
        {items.map((item, i) => {

          const link = '/anime/' + props.category + '/' + item.id;

          return (
            <SNavLink to={link} key={i}>
              <div className='movie-card'>
                <img src={item.coverImage.extraLarge} alt={item.title.english || item.title.romaji || item.title.native} />
                <div><AiFillPlayCircle /></div>
              </div>
              <div className='card-title'>{item.title.english || item.title.romaji || item.title.native}</div>
            </SNavLink>
          )
        })}
      </div>
      <div className="btn-container">
        {
          totalPage%20 === 0 ? (
            <button className='btn-container__loadmore' onClick={loadMore}>Load More</button>
          ) : null
        }
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

export default AnimeGrid;



// Try replacing set state variables with a const