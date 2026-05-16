import { useEffect, useRef, useState } from 'react';

export default function TypewriterText({
  text,
  speed = 50,
  onComplete,
  className = '',
  hideCursorAfterMs = 1000,
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const startedRef = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const node = containerRef.current;

    if (!node) {
      return undefined;
    }

    let intervalId = 0;
    let cursorTimeoutId = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting || startedRef.current) {
          return;
        }

        startedRef.current = true;
        let index = 0;

        intervalId = window.setInterval(() => {
          index += 1;
          setDisplayedText(text.slice(0, index));

          if (index >= text.length) {
            window.clearInterval(intervalId);

            if (typeof onComplete === 'function') {
              onComplete();
            }

            if (hideCursorAfterMs !== null) {
              cursorTimeoutId = window.setTimeout(() => {
                setShowCursor(false);
              }, hideCursorAfterMs);
            }
          }
        }, speed);

        observer.disconnect();
      },
      { threshold: 0.55 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearInterval(intervalId);
      window.clearTimeout(cursorTimeoutId);
    };
  }, [hideCursorAfterMs, onComplete, speed, text]);

  return (
    <span ref={containerRef} className={className}>
      {displayedText}
      <span
        className={`typewriter-cursor${showCursor ? '' : ' typewriter-cursor--hidden'}`}
        aria-hidden="true"
      >
        |
      </span>
    </span>
  );
}
