import { useEffect, useState } from 'react';

function getScrollProgress() {
  if (typeof window === 'undefined') {
    return 0;
  }

  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (scrollableHeight <= 0) {
    return 0;
  }

  return Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1);
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(() => getScrollProgress());

  useEffect(() => {
    let frameId = 0;
    let ticking = false;

    const updateScrollProgress = () => {
      ticking = false;
      setScrollProgress(getScrollProgress());
    };

    const handleScroll = () => {
      if (ticking) {
        return;
      }

      // Scroll events only schedule one repaint update so React does not rerender on every native event.
      ticking = true;
      frameId = window.requestAnimationFrame(updateScrollProgress);
    };

    const handleResize = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(updateScrollProgress);
    };

    handleResize();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { scrollProgress };
}

export default useScrollProgress;
