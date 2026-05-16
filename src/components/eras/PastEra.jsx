import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { pastData } from '../../data/past';
import TypewriterText from '../ui/TypewriterText';

gsap.registerPlugin(ScrollTrigger);

export default function PastEra({ eraProgress }) {
  const sectionRef = useRef(null);
  const sublineRef = useRef(null);
  const aboutLineRefs = useRef([]);
  const itemRefs = useRef([]);
  const [headlineComplete, setHeadlineComplete] = useState(false);

  aboutLineRefs.current = [];
  itemRefs.current = [];

  useEffect(() => {
    const section = sectionRef.current;
    const subline = sublineRef.current;

    if (!section || !subline) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.set(subline, { opacity: 0, y: 12 });

      // The about block unfolds like a diary note, one line at a time, before the timeline begins.
      gsap.fromTo(
        aboutLineRefs.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutLineRefs.current[0],
            start: 'top 84%',
            toggleActions: 'play none none none',
          },
        }
      );

      itemRefs.current.forEach((item, index) => {
        if (!item) {
          return;
        }

        // Each timeline card waits for its own viewport entry so the section feels discovered instead of dumped all at once.
        gsap.fromTo(
          item,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  useEffect(() => {
    const subline = sublineRef.current;

    if (!headlineComplete || !subline) {
      return undefined;
    }

    // The subline arrives after the typewriter completes so the hero reads like one composed beat.
    const tween = gsap.to(subline, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: 0.6,
      ease: 'power2.out',
    });

    return () => {
      tween.kill();
    };
  }, [headlineComplete]);

  const setItemRef = (element) => {
    if (element) {
      itemRefs.current.push(element);
    }
  };

  const setAboutLineRef = (element) => {
    if (element) {
      aboutLineRefs.current.push(element);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="past-era"
      data-era-progress={eraProgress}
      aria-label="Past era"
    >
      <div className="past-era__grain" aria-hidden="true" />
      <div className="past-era__vignette" aria-hidden="true" />

      <div className="past-era__content">
        <div className="past-era__monogram">{pastData.monogram}</div>

        <header className="past-era__hero">
          <h2 className="past-era__headline">
            <TypewriterText
              text={pastData.headline}
              speed={50}
              onComplete={() => setHeadlineComplete(true)}
            />
          </h2>
          <p ref={sublineRef} className="past-era__subline">
            {pastData.subline}
          </p>
        </header>

        <section className="past-era__about" aria-label="About me">
          <span className="past-era__about-quote" aria-hidden="true">
            "
          </span>

          {pastData.aboutMe.text.map((line, index) => (
            <p
              key={line}
              ref={setAboutLineRef}
              className={`past-era__about-line${
                index === 1 || index === 2 ? ' past-era__about-line--accent' : ''
              }`}
            >
              {line}
            </p>
          ))}
        </section>

        <div className="past-era__timeline">
          <div className="past-era__timeline-line" aria-hidden="true" />

          {pastData.timeline.map((item) => (
            <article
              key={`${item.year}-${item.title}`}
              ref={setItemRef}
              className={`past-era__timeline-item past-era__timeline-item--${item.type}`}
            >
              <div className="past-era__year">{item.year}</div>
              <div className="past-era__marker" aria-hidden="true">
                <span className="past-era__dot" />
              </div>
              <div className="past-era__entry">
                <h3 className="past-era__title">{item.title}</h3>
                <p className="past-era__desc">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="past-era__hint">{`scroll forward \u2192`}</div>
      </div>
    </section>
  );
}
