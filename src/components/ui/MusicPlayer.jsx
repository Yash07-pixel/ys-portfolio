import { useEffect, useRef, useState } from 'react';

const TRACK = {
  src: '/fur-elise.mp3',
};

function Icon({ path, className = 'music-player__icon' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} fill="currentColor" />
    </svg>
  );
}

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return undefined;
    }

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
  };

  return (
    <aside className="music-player" aria-label="Music player">
      <audio ref={audioRef} preload="metadata" src={TRACK.src} />

      <div className="music-player__mini">
        <div className="music-player__eyebrow-group">
          <Icon
            className="music-player__eyebrow-icon"
            path="M12 3v10.55A4 4 0 1 0 14 17V7h4V3zM6 8v7.55A4 4 0 1 0 8 15V5h4V1z"
          />
          <span className="music-player__label">YS RADIO</span>
        </div>

        <button
          className="music-player__button music-player__button--mini"
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause track' : 'Play track'}
        >
          {isPlaying ? (
            <Icon path="M7 5h4v14H7zm6 0h4v14h-4z" />
          ) : (
            <Icon path="M8 5v14l11-7z" />
          )}
        </button>
      </div>
    </aside>
  );
}
