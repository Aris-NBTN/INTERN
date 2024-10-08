import React, { useEffect, useRef } from 'react';
import { MediaPlayer, MediaProvider, Poster, Time, Track } from '@vidstack/react';
import { DefaultAudioLayout, defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import './Video.css';

const Video = ({ list, time, title, src, poster, textTracks, thumbnailTracks, autoPlay = true, height = 'auto', mediaPlayerRef }) => {
  return (
    <MediaPlayer
      ref={mediaPlayerRef}
      style={{ height: height }}
      className="player"
      title={title}
      src={src}
      currentTime={time}
      crossorigin
      aspectRatio='16:9'
      onEnded={() => console.log('Video ended')}
      autoplay={autoPlay}
    >
      <MediaProvider>
        <Poster className="vds-poster" src={poster} />
        {textTracks?.map((track) => (
          <Track {...track} key={track.src} />
        ))}
      </MediaProvider>
      <DefaultAudioLayout icons={defaultLayoutIcons} />
      <DefaultVideoLayout
        icons={defaultLayoutIcons}
        thumbnails={thumbnailTracks}
      />
    </MediaPlayer>
  );
};

export default Video;
