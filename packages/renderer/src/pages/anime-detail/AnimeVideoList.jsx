// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react'

const AnimeVideoList = (props) => {

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const getVideos = async () => {
      setVideos(props.vid);
    }
    getVideos();
  }, [props.vid])

  return (
    <>
      <Video item={videos} />
    </>
  );
};

const Video = props => {

  const item = props.item;

  const iframeRef = useRef(null);

  useEffect(() => {
    const height = iframeRef.current.offsetWidth * 9 / 16 + 'px';
    iframeRef.current.setAttribute('height', height);
  }, []);

  return (
    <div className="video">
      <div className="video__title">
        <h2>Trailer</h2>
      </div>
      <iframe
        src={`https://www.youtube.com/embed/${item.id}`}
        ref={iframeRef}
        width="100%"
        title='video'
      >

      </iframe>
    </div>
  )
}

export default AnimeVideoList;