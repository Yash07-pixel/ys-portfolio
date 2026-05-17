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

function isMeaningfulContent(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  const tagName = element.tagName.toLowerCase();
  const className = element.className.toLowerCase();

  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'a', 'button'].includes(tagName)) {
    return true;
  }

  return [
    'card',
    'project',
    'achievement',
    'timeline',
    'item',
    'badge',
    'feature',
    'skills',
    'marquee',
    'vision',
    'status',
    'cta',
    'message',
    'photo',
    'headline',
    'subline',
    'title',
    'desc',
  ].some((token) => className.includes(token));
}

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOccluded, setIsOccluded] = useState(false);

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

  useEffect(() => {
    let frameId = 0;

    const updateOcclusion = () => {
      const player = playerRef.current;

      if (!player) {
        setIsOccluded(false);
        return;
      }

      const rect = player.getBoundingClientRect();
      const samplePoints = [
        [rect.left + 18, rect.top + 18],
        [rect.right - 18, rect.top + 18],
        [rect.left + rect.width / 2, rect.top + rect.height / 2],
        [rect.left + 18, rect.bottom - 18],
        [rect.right - 18, rect.bottom - 18],
      ];

      const nextOccluded = samplePoints.some(([x, y]) => {
        const visibleX = Math.max(0, Math.min(window.innerWidth - 1, x));
        const visibleY = Math.max(0, Math.min(window.innerHeight - 1, y));

        return document.elementsFromPoint(visibleX, visibleY).some((element) => {
          if (!(element instanceof HTMLElement)) {
            return false;
          }

          if (
            player.contains(element) ||
            element.closest('.music-player') ||
            element.closest('.era-indicator') ||
            element.closest('.clock-dial') ||
            element.closest('.future-cursor')
          ) {
            return false;
          }

          if (!element.closest('.timeline-scroll')) {
            return false;
          }

          return isMeaningfulContent(element);
        });
      });

      setIsOccluded(nextOccluded);
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateOcclusion);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
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
    <aside
      ref={playerRef}
      className={`music-player${isOccluded ? ' music-player--hidden' : ''}`}
      aria-label="Music player"
    >
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
