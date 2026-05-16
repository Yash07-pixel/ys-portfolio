import { useEffect, useMemo, useRef, useState } from 'react';

const TRACK = {
  title: 'Für Elise',
  artist: 'Ludwig van Beethoven',
  src: '/fur-elise.mp3',
};

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return '0:00';
  }

  const wholeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(wholeSeconds / 60);
  const remainder = String(wholeSeconds % 60).padStart(2, '0');

  return `${minutes}:${remainder}`;
}

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.45);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return undefined;
    }

    audio.volume = volume;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume]);

  const progress = useMemo(() => {
    if (!duration) {
      return 0;
    }

    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  const togglePlayback = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const seekTo = (event) => {
    const audio = audioRef.current;
    const nextTime = Number(event.target.value);

    if (!audio) {
      return;
    }

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const updateVolume = (event) => {
    const audio = audioRef.current;
    const nextVolume = Number(event.target.value);

    if (audio) {
      audio.volume = nextVolume;
    }

    setVolume(nextVolume);
  };

  const skipBy = (seconds) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const nextTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration || 0);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <aside className="music-player" aria-label="Music player">
      <audio ref={audioRef} preload="metadata" src={TRACK.src} />

      <div className="music-player__eyebrow">
        <div className="music-player__eyebrow-group">
          <Icon
            className="music-player__eyebrow-icon"
            path="M12 3v10.55A4 4 0 1 0 14 17V7h4V3zM6 8v7.55A4 4 0 1 0 8 15V5h4V1z"
          />
          <span>YS RADIO</span>
        </div>
        <span className="music-player__caret">▼</span>
      </div>

      <div className="music-player__track">
        <h3 className="music-player__title">{TRACK.title}</h3>
        <p className="music-player__artist">{TRACK.artist}</p>
      </div>

      <div className="music-player__timeline">
        <input
          className="music-player__range music-player__range--progress"
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={seekTo}
          style={{ '--range-progress': `${progress}%` }}
          aria-label="Seek track"
        />
        <div className="music-player__times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="music-player__controls">
        <button
          className="music-player__button"
          type="button"
          onClick={() => skipBy(-10)}
          aria-label="Back 10 seconds"
        >
          <Icon path="M11 6v12l-8-6zm10 0v12l-8-6z" />
        </button>

        <button
          className="music-player__button music-player__button--primary"
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

        <button
          className="music-player__button"
          type="button"
          onClick={() => skipBy(10)}
          aria-label="Forward 10 seconds"
        >
          <Icon path="M13 6v12l8-6zm-10 0v12l8-6z" />
        </button>
      </div>

      <div className="music-player__volume">
        <Icon
          className="music-player__volume-icon"
          path="M3 10v4h4l5 4V6L7 10zm12.5 2a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 15.5 12m0-8.5v2.06a8 8 0 0 1 0 12.88v2.06a10.5 10.5 0 0 0 0-17z"
        />
        <input
          className="music-player__range music-player__range--volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={updateVolume}
          style={{ '--range-progress': `${volume * 100}%` }}
          aria-label="Volume"
        />
        <Icon
          className="music-player__volume-icon"
          path="M3 10v4h4l5 4V6L7 10zm12.5 2a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 15.5 12m0-8.5v2.06a8 8 0 0 1 0 12.88v2.06a10.5 10.5 0 0 0 0-17zm4 8.5a12.5 12.5 0 0 0-4-9.18v2.7a9.5 9.5 0 0 1 0 12.96v2.7a12.5 12.5 0 0 0 4-9.18"
        />
      </div>
    </aside>
  );
}
