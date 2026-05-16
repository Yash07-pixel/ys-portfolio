import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function ClockDial({ scrollProgress, currentEra }) {
  const handRef = useRef(null);

  useEffect(() => {
    if (!handRef.current) {
      return;
    }

    gsap.to(handRef.current, {
      rotate: scrollProgress * 360,
      duration: 0.25,
      ease: 'power2.out',
    });
  }, [scrollProgress]);

  return (
    <div
      className="clock-dial"
      aria-hidden="true"
      data-era={currentEra}
    >
      <span className="clock-dial__tick clock-dial__tick--top" />
      <span className="clock-dial__track" />
      <span ref={handRef} className="clock-dial__hand" />
      <span className="clock-dial__pivot">
        <span className="clock-dial__pivot-text">YS</span>
      </span>
      <span className="clock-dial__tick clock-dial__tick--bottom" />
    </div>
  );
}
