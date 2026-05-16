import { useEffect, useRef } from 'react';

const TRAIL_COUNT = 5;

export default function FutureCursor() {
  const viewportCenter =
    typeof window === 'undefined'
      ? { x: 0, y: 0 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const trailRefs = useRef([]);
  const mouseRef = useRef(viewportCenter);
  const currentRef = useRef(viewportCenter);
  const trailPositionsRef = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({
      x: viewportCenter.x,
      y: viewportCenter.y,
    }))
  );
  const frameRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const tick = () => {
      currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * 0.22;
      currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * 0.22;

      const nextTrail = [
        { x: currentRef.current.x, y: currentRef.current.y },
        ...trailPositionsRef.current.slice(0, TRAIL_COUNT - 1),
      ];
      trailPositionsRef.current = nextTrail;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentRef.current.x - 5}px, ${currentRef.current.y - 5}px)`;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${currentRef.current.x - 1.5}px, ${currentRef.current.y - 1.5}px)`;
      }

      trailRefs.current.forEach((trail, index) => {
        if (!trail) {
          return;
        }

        const point = nextTrail[index];
        const size = 6 - index * 0.8;
        trail.style.transform = `translate(${point.x - size / 2}px, ${point.y - size / 2}px)`;
      });

      frameRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove);
    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const setTrailRef = (element, index) => {
    trailRefs.current[index] = element;
  };

  return (
    <div className="future-cursor" aria-hidden="true">
      {Array.from({ length: TRAIL_COUNT }).map((_, index) => (
        <span
          key={`trail-${index + 1}`}
          ref={(element) => setTrailRef(element, index)}
          className="future-cursor__trail"
        />
      ))}
      <span ref={cursorRef} className="future-cursor__ring" />
      <span ref={dotRef} className="future-cursor__dot" />
    </div>
  );
}
