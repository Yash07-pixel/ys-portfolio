import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  siClaude,
  siCplusplus,
  siDocker,
  siExpo,
  siFastapi,
  siFirebase,
  siGit,
  siGithub,
  siGooglegemini,
  siJavascript,
  siJsonwebtokens,
  siLinux,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siPython,
  siReact,
  siRender,
  siSocketdotio,
  siTailwindcss,
  siTensorflow,
  siTypescript,
  siVercel,
  siVite,
  siWebrtc,
} from 'simple-icons';
import { presentData, skillsMarquee } from '../../data/present';

gsap.registerPlugin(ScrollTrigger);

function hasLink(url) {
  return Boolean(url) && !url.includes('[add link]');
}

const skillLogos = {
  'React.js': siReact,
  FastAPI: siFastapi,
  'Next.js': siNextdotjs,
  'Node.js': siNodedotjs,
  TypeScript: siTypescript,
  TailwindCSS: siTailwindcss,
  'React Native': siReact,
  Expo: siExpo,
  WebRTC: siWebrtc,
  'Socket.io': siSocketdotio,
  Python: siPython,
  JavaScript: siJavascript,
  MongoDB: siMongodb,
  PostgreSQL: siPostgresql,
  Firebase: siFirebase,
  Docker: siDocker,
  Git: siGit,
  Linux: siLinux,
  Vercel: siVercel,
  Render: siRender,
  'Gemini API': siGooglegemini,
  'Claude API': siClaude,
  'TensorFlow.js': siTensorflow,
  JWT: siJsonwebtokens,
  'C++': siCplusplus,
  Java: siOpenjdk,
};

const projectTagLogos = {
  React: siReact,
  'React.js': siReact,
  FastAPI: siFastapi,
  DeepChem: null,
  RDKit: null,
  'AutoDock Vina': null,
  'Gemini API': siGooglegemini,
  PostgreSQL: siPostgresql,
  Docker: siDocker,
  MongoDB: siMongodb,
  JWT: siJsonwebtokens,
  'AES-256': null,
  'AES-256-CBC': null,
  'SHA-256': null,
  'Gemini 1.5 Flash': siGooglegemini,
  'Anakin Search API': null,
  Vite: siVite,
  TailwindCSS: siTailwindcss,
};

function renderSkillLogo(skill) {
  const icon = skillLogos[skill.name];

  if (!icon) {
    const fallback = skill.name
      .replace(/[^A-Za-z0-9+]/g, '')
      .slice(0, 2)
      .toUpperCase();

    return <span className="present-era__skill-card-fallback">{fallback}</span>;
  }

  return (
    <svg
      className="present-era__skill-card-logo"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  );
}

function renderProjectTagLogo(tag) {
  const icon = projectTagLogos[tag];

  if (!icon) {
    const fallback = tag
      .replace(/[^A-Za-z0-9+]/g, '')
      .slice(0, 2)
      .toUpperCase();

    return <span className="present-era__tag-fallback">{fallback}</span>;
  }

  return (
    <svg className="present-era__tag-logo" viewBox="0 0 24 24" aria-hidden="true">
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  );
}

function ActionIcon({ kind }) {
  if (kind === 'live') {
    return (
      <svg
        className="present-era__action-icon-svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M14 4h6v6h-2V7.41l-8.29 8.3-1.42-1.42 8.3-8.29H14zM6 6h5v2H8v8h8v-3h2v5H6z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      className="present-era__action-icon-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={siGithub.path} fill="currentColor" />
    </svg>
  );
}

export default function PresentEra({ eraProgress }) {
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const projectRefs = useRef([]);
  const experienceRef = useRef(null);
  const experienceCardRef = useRef(null);
  const pointRefs = useRef([]);
  const achievementRefs = useRef([]);
  const skillsSectionRef = useRef(null);
  const skillsHeaderRef = useRef(null);
  const skillsRowOneRef = useRef(null);
  const skillsRowTwoRef = useRef(null);
  const metricRefs = useRef([]);
  const metricsAnimatedRef = useRef(false);
  const [skillsRunning, setSkillsRunning] = useState(false);

  const experienceMetrics = [
    { value: 500, suffix: '+', label: 'Members Reached' },
    { value: 3, suffix: '', label: 'Workshops Led' },
    { value: 100, suffix: '+', label: 'Attendees / Event' },
  ];

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const context = gsap.context(() => {
      if (heroRef.current) {
        // The hero waits until the section enters view so the present era feels like a crisp scene change.
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Project cards reveal with a short stagger so the pair reads as a sequence instead of a jump cut.
      gsap.fromTo(
        projectRefs.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: projectRefs.current[0],
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      if (experienceCardRef.current) {
        gsap.fromTo(
          experienceCardRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: experienceRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
              onEnter: () => {
                if (!metricsAnimatedRef.current) {
                  metricsAnimatedRef.current = true;

                  // The counters only begin once the card has settled so the stats feel anchored, not frantic.
                  window.setTimeout(() => {
                    metricRefs.current.forEach((element, index) => {
                      const metric = experienceMetrics[index];

                      if (!element || !metric) {
                        return;
                      }

                      const startTime = performance.now();
                      const duration = 1000;

                      const tick = (currentTime) => {
                        const progress = Math.min(
                          (currentTime - startTime) / duration,
                          1
                        );
                        const eased = 1 - (1 - progress) * (1 - progress);
                        const value = Math.round(metric.value * eased);

                        element.textContent = `${value}${metric.suffix}`;

                        if (progress < 1) {
                          window.requestAnimationFrame(tick);
                        }
                      };

                      element.textContent = `0${metric.suffix}`;
                      window.requestAnimationFrame(tick);
                    });
                  }, 200);
                }
              },
            },
          }
        );
      }

      // Experience bullets cascade after the section frame appears so the details feel progressively disclosed.
      gsap.fromTo(
        pointRefs.current,
        { opacity: 0, x: 18 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.16,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: experienceRef.current,
            start: 'top 76%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        achievementRefs.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.14,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: achievementRefs.current[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      if (skillsSectionRef.current && skillsHeaderRef.current && skillsRowOneRef.current && skillsRowTwoRef.current) {
        const marqueeTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: skillsSectionRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
          onComplete: () => {
            setSkillsRunning(true);
          },
        });

        // The header lands first so the moving rows feel introduced instead of abruptly present.
        marqueeTimeline.fromTo(
          skillsHeaderRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
        );

        // Each row settles before its CSS marquee starts, which keeps the motion readable on entry.
        marqueeTimeline.fromTo(
          skillsRowOneRef.current,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.05'
        );

        marqueeTimeline.fromTo(
          skillsRowTwoRef.current,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.35'
        );
      }
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  const setProjectRef = (element, index) => {
    projectRefs.current[index] = element;
  };

  const setPointRef = (element, index) => {
    pointRefs.current[index] = element;
  };

  const setMetricRef = (element, index) => {
    metricRefs.current[index] = element;
  };

  const setAchievementRef = (element, index) => {
    achievementRefs.current[index] = element;
  };

  const highlightExperiencePoint = (point) => {
    const highlights = [
      'Next.js',
      '500+',
      '3 technical workshops',
      '100+',
      '6-person',
    ];

    const parts = [];
    let remaining = point;
    let key = 0;

    while (remaining.length > 0) {
      let nearestIndex = -1;
      let nearestHighlight = '';

      highlights.forEach((highlight) => {
        const index = remaining.indexOf(highlight);

        if (index !== -1 && (nearestIndex === -1 || index < nearestIndex)) {
          nearestIndex = index;
          nearestHighlight = highlight;
        }
      });

      if (nearestIndex === -1) {
        parts.push(<span key={`text-${key}`}>{remaining}</span>);
        break;
      }

      if (nearestIndex > 0) {
        parts.push(
          <span key={`text-${key}`}>{remaining.slice(0, nearestIndex)}</span>
        );
        key += 1;
      }

      parts.push(
        <span key={`highlight-${key}`} className="present-era__experience-highlight">
          {nearestHighlight}
        </span>
      );
      key += 1;
      remaining = remaining.slice(nearestIndex + nearestHighlight.length);
    }

    return parts;
  };

  const rowOneCards = [...skillsMarquee.rowOne, ...skillsMarquee.rowOne];
  const rowTwoCards = [...skillsMarquee.rowTwo, ...skillsMarquee.rowTwo];

  return (
    <section
      ref={sectionRef}
      className="present-era"
      data-era-progress={eraProgress}
      aria-label="Present era"
    >
      <div className="present-era__grid" aria-hidden="true" />

      <div className="present-era__content">
        <div className="present-era__monogram">{presentData.monogram}</div>

        <header ref={heroRef} className="present-era__hero">
          <h2 className="present-era__headline">{presentData.headline}</h2>
          <p className="present-era__subline">{presentData.subline}</p>
        </header>

        <section className="present-era__projects" aria-label="Projects">
          {presentData.projects.map((project, index) => (
            <article
              key={project.id}
              ref={(element) => setProjectRef(element, index)}
              className="present-era__project-card"
              style={{ '--project-accent': project.accent || 'var(--present-primary)' }}
            >
              <div className="present-era__project-head">
                <div className="present-era__project-title-block">
                  <h3 className="present-era__project-name">
                    <span className="present-era__project-name-line">
                      {project.namePrefix ? (
                        <span className="present-era__project-name-prefix">
                          {project.namePrefix}
                        </span>
                      ) : null}
                      <span>{project.name}</span>
                    </span>
                  </h3>

                  {project.achievement ? (
                    <div className="present-era__achievement-pill">
                      {project.achievement}
                    </div>
                  ) : null}
                </div>

                <span className="present-era__project-category">
                  {project.category}
                </span>
              </div>

              <div className="present-era__project-copy">
                {project.tagline ? (
                  <p className="present-era__project-tagline">{project.tagline}</p>
                ) : null}

                <p className="present-era__project-desc">{project.desc}</p>

                {project.features?.length ? (
                  <div className="present-era__project-features" aria-label={`${project.name} features`}>
                    {project.features.map((feature) => (
                      <p key={feature} className="present-era__project-feature">
                        {feature}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="present-era__project-footer">
                <div className="present-era__tag-list">
                  {project.tags.map((tag) => (
                    <span key={tag} className="present-era__tag">
                      <span className="present-era__tag-icon" aria-hidden="true">
                        {renderProjectTagLogo(tag)}
                      </span>
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                <div className="present-era__project-actions">
                  {hasLink(project.github) ? (
                    <a
                      className="present-era__action-button"
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.name} GitHub repository`}
                    >
                      <ActionIcon kind="github" />
                    </a>
                  ) : (
                    <span
                      className="present-era__action-button present-era__action-button--disabled"
                      aria-label={`${project.name} GitHub unavailable`}
                    >
                      <ActionIcon kind="github" />
                    </span>
                  )}

                  {hasLink(project.live) ? (
                    <a
                      className="present-era__action-button"
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.name} live demo`}
                    >
                      <ActionIcon kind="live" />
                    </a>
                  ) : (
                    <span
                      className="present-era__action-button present-era__action-button--disabled"
                      aria-label={`${project.name} live demo unavailable`}
                    >
                      <ActionIcon kind="live" />
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>

        <section
          ref={experienceRef}
          className="present-era__experience"
          aria-label="Experience"
        >
          <div className="present-era__experience-header">
            <p className="present-era__experience-kicker">// EXPERIENCE</p>
            <p className="present-era__experience-subtitle">
              Where I led, not just contributed
            </p>
          </div>

          <article ref={experienceCardRef} className="present-era__experience-card">
            <div className="present-era__experience-accent" aria-hidden="true" />
            <div className="present-era__experience-watermark" aria-hidden="true">
              IEEE
            </div>

            <div className="present-era__experience-top">
              <div className="present-era__experience-meta">
                <p className="present-era__experience-role">
                  {presentData.experience.role}
                </p>

                <div className="present-era__experience-org-row">
                  <span className="present-era__experience-org-badge" aria-hidden="true">
                    ⚡
                  </span>
                  <p className="present-era__experience-org">
                    {presentData.experience.org}
                  </p>
                </div>
              </div>

              <p className="present-era__experience-year">
                {presentData.experience.year}
              </p>
            </div>

            <div className="present-era__experience-divider" aria-hidden="true" />

            <div className="present-era__experience-metrics" aria-label="Impact metrics">
              {experienceMetrics.map((metric, index) => (
                <div key={metric.label} className="present-era__experience-metric">
                  <p
                    ref={(element) => setMetricRef(element, index)}
                    className="present-era__experience-metric-value"
                  >
                    0{metric.suffix}
                  </p>
                  <p className="present-era__experience-metric-label">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="present-era__experience-points">
              {presentData.experience.points.map((point, index) => (
                <div
                  key={point}
                  ref={(element) => setPointRef(element, index)}
                  className="present-era__experience-point"
                >
                  <span
                    className="present-era__experience-point-accent"
                    aria-hidden="true"
                  />
                  <p className="present-era__experience-point-text">
                    {highlightExperiencePoint(point)}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="present-era__achievements" aria-label="Achievements">
          <div className="present-era__achievements-header">
            <p className="present-era__achievements-kicker">// ACHIEVEMENTS</p>
            <p className="present-era__achievements-subtitle">
              Milestones worth mentioning
            </p>
          </div>

          <div className="present-era__achievements-grid">
            {presentData.achievements.map((item, index) => (
              <article
                key={item.id}
                ref={(element) => setAchievementRef(element, index)}
                className="present-era__achievement-card"
                style={{ '--achievement-accent': item.tagColor }}
              >
                <div className="present-era__achievement-accent" aria-hidden="true" />

                <div className="present-era__achievement-top">
                  <span className="present-era__achievement-emoji" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <span className="present-era__achievement-tag">{item.tag}</span>
                </div>

                <h3 className="present-era__achievement-title">{item.title}</h3>
                <p className="present-era__achievement-context">{item.context}</p>
                <p className="present-era__achievement-desc">{item.desc}</p>

                <div className="present-era__achievement-stat">
                  <span
                    className="present-era__achievement-stat-dot"
                    aria-hidden="true"
                  />
                  <span>{item.stat}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          ref={skillsSectionRef}
          className="present-era__skills-marquee"
          aria-label="Skills"
        >
          <div ref={skillsHeaderRef} className="present-era__skills-marquee-header">
            <p className="present-era__skills-marquee-title">{skillsMarquee.title}</p>
            <p className="present-era__skills-marquee-subtitle">{skillsMarquee.subtitle}</p>
          </div>

          <div ref={skillsRowOneRef} className="present-era__marquee-row">
            <div
              className={`present-era__marquee-track present-era__marquee-track--left${
                skillsRunning ? ' present-era__marquee-track--running' : ''
              }`}
            >
              {rowOneCards.map((skill, index) => (
                <article
                  key={`${skill.name}-row1-${index}`}
                  className="present-era__skill-card"
                  style={{ '--skill-accent': skill.color }}
                >
                  <span className="present-era__skill-card-icon" aria-hidden="true">
                    {renderSkillLogo(skill)}
                  </span>
                  <p className="present-era__skill-card-name">{skill.name}</p>
                  <p className="present-era__skill-card-category">{skill.categoryLabel}</p>
                </article>
              ))}
            </div>
          </div>

          <div ref={skillsRowTwoRef} className="present-era__marquee-row">
            <div
              className={`present-era__marquee-track present-era__marquee-track--right${
                skillsRunning ? ' present-era__marquee-track--running' : ''
              }`}
            >
              {rowTwoCards.map((skill, index) => (
                <article
                  key={`${skill.name}-row2-${index}`}
                  className="present-era__skill-card"
                  style={{ '--skill-accent': skill.color }}
                >
                  <span className="present-era__skill-card-icon" aria-hidden="true">
                    {renderSkillLogo(skill)}
                  </span>
                  <p className="present-era__skill-card-name">{skill.name}</p>
                  <p className="present-era__skill-card-category">{skill.categoryLabel}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="present-era__hint">{`continuing forward \u2192`}</div>
      </div>
    </section>
  );
}
