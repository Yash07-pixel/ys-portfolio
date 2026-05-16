import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ERA_ORDER = ['past', 'present', 'future'];

export default function EraIndicator({ currentEra }) {
  const dotRef = useRef(null);
  const activeEra = currentEra === 'contact' ? 'future' : currentEra;

  useEffect(() => {
    if (!dotRef.current) {
      return;
    }

    const index = ERA_ORDER.indexOf(activeEra);
    const targetX = index * 58;

    gsap.to(dotRef.current, {
      x: targetX,
      duration: 0.4,
      ease: 'back.out(1.5)',
    });
  }, [activeEra]);

  return (
    <div className="era-indicator" aria-label="Era indicator">
      <div className="era-indicator__track" aria-hidden="true">
        <span
          className={`era-indicator__line era-indicator__line--left${
            activeEra !== 'past' ? ' era-indicator__line--filled' : ''
          }`}
        />
        <span
          className={`era-indicator__line era-indicator__line--right${
            activeEra === 'future' ? ' era-indicator__line--filled' : ''
          }`}
        />
        <span ref={dotRef} className="era-indicator__dot" />
      </div>

      <div className="era-indicator__labels">
        {ERA_ORDER.map((era) => (
          <span
            key={era}
            className={`era-indicator__label${
              activeEra === era
                ? ' era-indicator__label--active'
                : ''
            }`}
          >
            {era.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
