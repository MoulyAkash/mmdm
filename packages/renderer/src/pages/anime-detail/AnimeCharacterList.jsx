// @ts-nocheck
import React, { useEffect, useState } from 'react';

const AnimeCharacterList = (props) => {

  const [characters, setCharacters] = useState(props.characters);

  useEffect(() => {

    setCharacters(props.characters);

  }, [props.characters])

  return (
    <div className='casts'>
      {
        characters.map((item, i) => {
          return (
            <div key={i} className="casts__item">
              <div className="casts__item__img" style={{ backgroundImage: `url(${item.image.large})` }}></div>
              <p className='casts__item__name'>{item.name.full}</p>
            </div>
          )
        })
      }
    </div>
  );
};

export default AnimeCharacterList;