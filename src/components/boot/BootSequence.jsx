import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const HELLO_WORDS = [
  '\u0928\u092e\u0938\u094d\u0924\u0947',
  'Hello',
  'Hola',
  '\u3053\u3093\u306b\u3061\u306f',
  'Bonjour',
  '\u0645\u0631\u062d\u0628\u0627',
  'Namaste',
];

const HELLO_MIN_SIZE = 28;
const HELLO_MAX_SIZE = 52;
const HELLO_FADE_IN_MS = 300;
const HELLO_FADE_OUT_MS = 200;
const HELLO_GAP_MS = 80;
const HELLO_HOLD_MS = 40;

const WELCOME_HOLD_MS = 500;
const WELCOME_FADE_OUT_MS = 260;
const INITIAL_FADE_MS = 240;
const INITIAL_PAUSE_MS = 120;
const INITIALS_HOLD_MS = 700;
const FINAL_FADE_MS = 380;
const SKIP_FADE_MS = 300;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function getUniqueHelloSizes() {
  const scale = typeof window !== 'undefined' && window.innerWidth < 768 ? 0.8 : 1;
  const used = new Set();

  return HELLO_WORDS.map(() => {
    let size = Math.round(randomBetween(HELLO_MIN_SIZE, HELLO_MAX_SIZE) * scale);

    while (used.has(size)) {
      size = Math.round(randomBetween(HELLO_MIN_SIZE, HELLO_MAX_SIZE));
    }

    used.add(size);
    return size;
  });
}

function animateOpacity(target, opacity, durationMs) {
  return new Promise((resolve) => {
    gsap.to(target, {
      opacity,
      duration: durationMs / 1000,
      ease: 'power2.out',
      onComplete: resolve,
    });
  });
}

function setCenteredTextClasses(target) {
  target.className =
    'pointer-events-none absolute inset-0 flex items-center justify-center text-center';
}

export default function BootSequence({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const completedRef = useRef(false);
  const skippingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) {
      return undefined;
    }

    mountedRef.current = true;
    gsap.set(container, { opacity: 1 });
    gsap.set(text, { opacity: 0, x: 0 });

    const finish = () => {
      if (completedRef.current) {
        return;
      }

      completedRef.current = true;

      if (typeof onComplete === 'function') {
        onComplete();
      }
    };

    const skipToEnd = async () => {
      if (skippingRef.current || completedRef.current) {
        return;
      }

      skippingRef.current = true;
      gsap.killTweensOf([container, text]);
      gsap.killTweensOf(container.querySelectorAll('*'));

      await animateOpacity(container, 0, SKIP_FADE_MS);

      if (!mountedRef.current) {
        return;
      }

      finish();
    };

    const runSequence = async () => {
      const sizes = getUniqueHelloSizes();

      for (let index = 0; index < HELLO_WORDS.length; index += 1) {
        if (skippingRef.current || !mountedRef.current) {
          return;
        }

        const word = HELLO_WORDS[index];
        const opacity = randomBetween(0.6, 1);

        text.innerHTML = word;
        setCenteredTextClasses(text);
        text.style.fontFamily = "'Segoe UI', system-ui, -apple-system, sans-serif";
        text.style.fontSize = `${sizes[index]}px`;
        text.style.fontWeight = '400';
        text.style.letterSpacing = '0';
        text.style.color = '#FFFFFF';

        gsap.set(text, { opacity: 0, x: 0 });
        await animateOpacity(text, opacity, HELLO_FADE_IN_MS);

        if (skippingRef.current || !mountedRef.current) {
          return;
        }

        await sleep(HELLO_HOLD_MS);

        if (skippingRef.current || !mountedRef.current) {
          return;
        }

        await animateOpacity(text, 0, HELLO_FADE_OUT_MS);

        if (skippingRef.current || !mountedRef.current) {
          return;
        }

        await sleep(HELLO_GAP_MS);
      }

      if (skippingRef.current || !mountedRef.current) {
        return;
      }

      text.innerHTML = 'Welcome.';
      setCenteredTextClasses(text);
      text.style.fontFamily = 'Inter, sans-serif';
      text.style.fontSize = '48px';
      text.style.fontWeight = '300';
      text.style.letterSpacing = '0';
      text.style.color = '#F0EDE6';
      if (window.innerWidth < 768) {
        text.style.fontSize = '38px';
      }

      gsap.set(text, { opacity: 0, x: 0 });
      await animateOpacity(text, 1, HELLO_FADE_IN_MS);

      if (skippingRef.current || !mountedRef.current) {
        return;
      }

      await sleep(WELCOME_HOLD_MS);

      if (skippingRef.current || !mountedRef.current) {
        return;
      }

      await animateOpacity(text, 0, WELCOME_FADE_OUT_MS);

      if (skippingRef.current || !mountedRef.current) {
        return;
      }

      text.innerHTML = `
        <span class="boot-initials">
          <span data-letter="y">Y</span>
          <span data-letter="s">S</span>
        </span>
      `;
      setCenteredTextClasses(text);
      text.style.fontFamily = 'Inter, sans-serif';
      text.style.fontSize = '72px';
      text.style.fontWeight = '200';
      text.style.letterSpacing = '24px';
      text.style.color = '#FFFFFF';
      if (window.innerWidth < 768) {
        text.style.fontSize = '58px';
      }

      const initials = text.querySelector('.boot-initials');
      const yLetter = text.querySelector('[data-letter="y"]');
      const sLetter = text.querySelector('[data-letter="s"]');

      if (!initials || !yLetter || !sLetter) {
        finish();
        return;
      }

      initials.className = 'boot-initials flex items-center justify-center gap-6';
      gsap.set(text, { opacity: 1, x: 0 });
      gsap.set(yLetter, { opacity: 0 });
      gsap.set(sLetter, { opacity: 0 });

      await animateOpacity(yLetter, 1, INITIAL_FADE_MS);

      if (skippingRef.current || !mountedRef.current) {
        return;
      }

      await sleep(INITIAL_PAUSE_MS);

      if (skippingRef.current || !mountedRef.current) {
        return;
      }

      await animateOpacity(sLetter, 1, INITIAL_FADE_MS);

      if (skippingRef.current || !mountedRef.current) {
        return;
      }

      await sleep(INITIALS_HOLD_MS);

      if (skippingRef.current || !mountedRef.current) {
        return;
      }

      await animateOpacity(container, 0, FINAL_FADE_MS);

      if (!mountedRef.current) {
        return;
      }

      finish();
    };

    runSequence();

    container.addEventListener('click', skipToEnd);

    return () => {
      mountedRef.current = false;
      container.removeEventListener('click', skipToEnd);
      gsap.killTweensOf([container, text]);
      gsap.killTweensOf(container.querySelectorAll('*'));
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-black"
      role="presentation"
    >
      <div ref={textRef} className="absolute inset-0" />
    </div>
  );
}
