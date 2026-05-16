import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { futureData, futureVision } from '../../data/future';
import TypewriterText from '../ui/TypewriterText';

gsap.registerPlugin(ScrollTrigger);

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/*+?';
const PARTICLE_COUNT = 400;
const GLITCH_LINE_COUNT = 6;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function buildStatusLines(status) {
  return Object.entries(status).map(([key, value]) => ({
    key,
    text: `> ${key.toUpperCase()}: ${value}`,
  }));
}

const FUTURE_STATUS_LINES = buildStatusLines(futureData.status);
const FUTURE_VISION_ENTRIES = Object.entries(futureVision).map(([id, item], index) => ({
  id,
  ...item,
  glitchDelay: `${index * 2}s`,
}));

function getScrambledText(target, progress) {
  const resolvedCount = Math.floor(target.length * progress);

  return target
    .split('')
    .map((char, index) => {
      if (char === ' ') {
        return ' ';
      }

      if (index < resolvedCount) {
        return target[index];
      }

      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    })
    .join('');
}

export default function FutureEra({ eraProgress, isActive }) {
  const sectionRef = useRef(null);
  const canvasHostRef = useRef(null);
  const heroRef = useRef(null);
  const visionRefs = useRef([]);
  const visionLabelRefs = useRef([]);
  const visionSubRefs = useRef([]);
  const statusRef = useRef(null);
  const ctaRef = useRef(null);
  const glitchLineRefs = useRef([]);
  const sectionVisibleRef = useRef(false);
  const isActiveRef = useRef(isActive);
  const headlineStartedRef = useRef(false);
  const statusStartedRef = useRef(false);
  const headlineIntervalRef = useRef(0);
  const visionTriggerRef = useRef(null);
  const visionTimeoutsRef = useRef([]);
  const visionIntervalsRef = useRef([]);
  const visionsStartedRef = useRef(false);
  const statusTimeoutsRef = useRef([]);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const geometryRef = useRef(null);
  const frameRef = useRef(0);
  const materialRef = useRef(null);
  const positionsRef = useRef(null);
  const alphasRef = useRef(null);
  const velocitiesRef = useRef([]);
  const pulsePhasesRef = useRef([]);
  const pulseSpeedsRef = useRef([]);
  const [headlineText, setHeadlineText] = useState('');
  const [headlineResolved, setHeadlineResolved] = useState(false);
  const [statusLines, setStatusLines] = useState([]);
  const [visionHeadlines, setVisionHeadlines] = useState(
    FUTURE_VISION_ENTRIES.map(() => '')
  );
  const [visionResolved, setVisionResolved] = useState(
    FUTURE_VISION_ENTRIES.map(() => false)
  );

  const statusEntries = FUTURE_STATUS_LINES;

  useEffect(() => {
    const section = sectionRef.current;
    const canvasHost = canvasHostRef.current;

    if (!section || !canvasHost) {
      return undefined;
    }

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const alphas = new Float32Array(PARTICLE_COUNT);
    const velocities = [];
    const pulsePhases = [];
    const pulseSpeeds = [];
    const uniformState = { value: 0 };
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    geometryRef.current = geometry;
    positionsRef.current = positions;
    alphasRef.current = alphas;
    velocitiesRef.current = velocities;
    pulsePhasesRef.current = pulsePhases;
    pulseSpeedsRef.current = pulseSpeeds;

    const colorChoices = [
      { color: new THREE.Color('#FF00FF'), weight: 0.6 },
      { color: new THREE.Color('#7C3AED'), weight: 0.3 },
      { color: new THREE.Color('#00FF88'), weight: 0.1 },
    ];

    const pickColor = () => {
      const roll = Math.random();

      if (roll < colorChoices[0].weight) {
        return colorChoices[0].color;
      }

      if (roll < colorChoices[0].weight + colorChoices[1].weight) {
        return colorChoices[1].color;
      }

      return colorChoices[2].color;
    };

    const setCameraBounds = () => {
      const { clientWidth, clientHeight } = section;
      camera.left = clientWidth / -2;
      camera.right = clientWidth / 2;
      camera.top = clientHeight / 2;
      camera.bottom = clientHeight / -2;
      camera.near = -100;
      camera.far = 100;
      camera.position.z = 10;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const seedParticles = () => {
      const width = section.clientWidth;
      const height = section.clientHeight;

      for (let index = 0; index < PARTICLE_COUNT; index += 1) {
        const positionIndex = index * 3;
        const color = pickColor();

        positions[positionIndex] = randomBetween(width / -2, width / 2);
        positions[positionIndex + 1] = randomBetween(height / -2, height / 2);
        positions[positionIndex + 2] = 0;

        colors[positionIndex] = color.r;
        colors[positionIndex + 1] = color.g;
        colors[positionIndex + 2] = color.b;

        sizes[index] = randomBetween(0.5, 2);
        alphas[index] = randomBetween(0.3, 0.8);
        velocities[index] = {
          x: randomBetween(-0.12, 0.12),
          y: randomBetween(-0.08, 0.08),
        };
        pulsePhases[index] = randomBetween(0, Math.PI * 2);
        pulseSpeeds[index] = randomBetween(0.8, 1.6);
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    };

    seedParticles();

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uOpacity: uniformState,
      },
      vertexShader: `
        attribute float aSize;
        attribute float aAlpha;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vAlpha = aAlpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * 2.2;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor, strength * vAlpha * uOpacity);
        }
      `,
      vertexColors: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    renderer.domElement.className = 'future-era__canvas';
    canvasHost.appendChild(renderer.domElement);
    setCameraBounds();

    const animate = (time) => {
      const width = section.clientWidth;
      const height = section.clientHeight;
      const timeSeconds = time * 0.001;

      for (let index = 0; index < PARTICLE_COUNT; index += 1) {
        const positionIndex = index * 3;

        positions[positionIndex] += velocities[index].x;
        positions[positionIndex + 1] += velocities[index].y;

        if (positions[positionIndex] > width / 2) {
          positions[positionIndex] = width / -2;
        } else if (positions[positionIndex] < width / -2) {
          positions[positionIndex] = width / 2;
        }

        if (positions[positionIndex + 1] > height / 2) {
          positions[positionIndex + 1] = height / -2;
        } else if (positions[positionIndex + 1] < height / -2) {
          positions[positionIndex + 1] = height / 2;
        }

        alphas[index] =
          0.3 +
          ((Math.sin(timeSeconds * pulseSpeeds[index] + pulsePhases[index]) + 1) / 2) *
            0.5;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.aAlpha.needsUpdate = true;
      renderer.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(animate);
    };

    if (isActiveRef.current) {
      frameRef.current = window.requestAnimationFrame(animate);
    }

    const handleResize = () => {
      setCameraBounds();
    };

    window.addEventListener('resize', handleResize);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 72%',
      end: 'bottom 30%',
      onEnter: () => {
        sectionVisibleRef.current = true;

        // Particle opacity fades independently from scroll so the field feels like it powers on with the era.
        gsap.to(uniformState, {
          value: 1,
          duration: 1,
          ease: 'power2.out',
          onUpdate: () => {
            material.uniforms.uOpacity.value = uniformState.value;
          },
        });
      },
      onEnterBack: () => {
        sectionVisibleRef.current = true;
        gsap.to(uniformState, {
          value: 1,
          duration: 1,
          ease: 'power2.out',
          onUpdate: () => {
            material.uniforms.uOpacity.value = uniformState.value;
          },
        });
      },
      onLeave: () => {
        sectionVisibleRef.current = false;
        gsap.to(uniformState, {
          value: 0,
          duration: 1,
          ease: 'power2.out',
          onUpdate: () => {
            material.uniforms.uOpacity.value = uniformState.value;
          },
        });
      },
      onLeaveBack: () => {
        sectionVisibleRef.current = false;
        gsap.to(uniformState, {
          value: 0,
          duration: 1,
          ease: 'power2.out',
          onUpdate: () => {
            material.uniforms.uOpacity.value = uniformState.value;
          },
        });
      },
    });

    return () => {
      trigger.kill();
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(frameRef.current);
      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === canvasHost) {
        canvasHost.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    isActiveRef.current = isActive;

    if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !geometryRef.current) {
      return;
    }

    const animate = (time) => {
      if (!isActiveRef.current) {
        frameRef.current = 0;
        return;
      }

      const section = sectionRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const geometry = geometryRef.current;
      const positions = positionsRef.current;
      const alphas = alphasRef.current;
      const velocities = velocitiesRef.current;
      const pulsePhases = pulsePhasesRef.current;
      const pulseSpeeds = pulseSpeedsRef.current;

      if (!section || !renderer || !scene || !camera || !geometry || !positions || !alphas) {
        return;
      }

      const width = section.clientWidth;
      const height = section.clientHeight;
      const timeSeconds = time * 0.001;

      for (let index = 0; index < PARTICLE_COUNT; index += 1) {
        const positionIndex = index * 3;

        positions[positionIndex] += velocities[index].x;
        positions[positionIndex + 1] += velocities[index].y;

        if (positions[positionIndex] > width / 2) {
          positions[positionIndex] = width / -2;
        } else if (positions[positionIndex] < width / -2) {
          positions[positionIndex] = width / 2;
        }

        if (positions[positionIndex + 1] > height / 2) {
          positions[positionIndex + 1] = height / -2;
        } else if (positions[positionIndex + 1] < height / -2) {
          positions[positionIndex + 1] = height / 2;
        }

        alphas[index] =
          0.3 +
          ((Math.sin(timeSeconds * pulseSpeeds[index] + pulsePhases[index]) + 1) / 2) *
            0.5;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.aAlpha.needsUpdate = true;
      renderer.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(animate);
    };

    if (isActive && !frameRef.current) {
      frameRef.current = window.requestAnimationFrame(animate);
    }

    if (!isActive && frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
  }, [isActive]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const runHeadlineScramble = () => {
      if (headlineStartedRef.current) {
        return;
      }

      headlineStartedRef.current = true;
      let frame = 0;
      const totalFrames = 30;
      headlineIntervalRef.current = window.setInterval(() => {
        frame += 1;
        const progress = frame / totalFrames;
        setHeadlineText(getScrambledText(futureData.headline, progress));

        if (frame >= totalFrames) {
          window.clearInterval(headlineIntervalRef.current);
          setHeadlineText(futureData.headline);
          setHeadlineResolved(true);
        }
      }, 40);
    };

    const context = gsap.context(() => {
      if (heroRef.current) {
        // The hero trigger starts the scramble once so the headline resolves exactly as the future era comes into focus.
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top 78%',
          once: true,
          onEnter: runHeadlineScramble,
        });
      }

      if (visionRefs.current[0]) {
        visionTriggerRef.current = ScrollTrigger.create({
          trigger: visionRefs.current[0],
          start: 'top 84%',
          once: true,
          onEnter: () => {
            if (visionsStartedRef.current) {
              return;
            }

            visionsStartedRef.current = true;

            FUTURE_VISION_ENTRIES.forEach((vision, index) => {
              const blockDelay = index * 300;
              const labelTimeout = window.setTimeout(() => {
                const labelElement = visionLabelRefs.current[index];

                if (labelElement) {
                  // Labels lead the cascade so each block announces itself before the statement resolves.
                  gsap.fromTo(
                    labelElement,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
                  );
                }
              }, blockDelay);
              visionTimeoutsRef.current.push(labelTimeout);

              const headlineTimeout = window.setTimeout(() => {
                let frame = 0;
                const totalFrames = 20;
                const intervalId = window.setInterval(() => {
                  frame += 1;
                  const progress = frame / totalFrames;

                  setVisionHeadlines((current) => {
                    const next = [...current];
                    next[index] = getScrambledText(vision.headline, progress);
                    return next;
                  });

                  if (frame >= totalFrames) {
                    window.clearInterval(intervalId);
                    setVisionHeadlines((current) => {
                      const next = [...current];
                      next[index] = vision.headline;
                      return next;
                    });
                    setVisionResolved((current) => {
                      const next = [...current];
                      next[index] = true;
                      return next;
                    });
                  }
                }, 40);

                visionIntervalsRef.current.push(intervalId);
              }, blockDelay + 200);
              visionTimeoutsRef.current.push(headlineTimeout);

              const subTimeout = window.setTimeout(() => {
                const subElement = visionSubRefs.current[index];

                if (subElement) {
                  gsap.fromTo(
                    subElement,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                  );
                }
              }, blockDelay + 1000);
              visionTimeoutsRef.current.push(subTimeout);
            });
          },
        });
      }

      if (statusRef.current) {
        ScrollTrigger.create({
          trigger: statusRef.current,
          start: 'top 84%',
          once: true,
          onEnter: () => {
            if (statusStartedRef.current) {
              return;
            }

            statusStartedRef.current = true;
            let totalDelay = 0;

            statusEntries.forEach((entry, index) => {
              const typingDuration = entry.text.length * 28;

              const timeoutId = window.setTimeout(() => {
                setStatusLines((current) => {
                  const next = [...current];
                  next[index] = entry.text;
                  return next;
                });
              }, totalDelay);
              statusTimeoutsRef.current.push(timeoutId);

              totalDelay += typingDuration + 200;
            });
          },
        });
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, section);

    return () => {
      window.clearInterval(headlineIntervalRef.current);
      visionTriggerRef.current?.kill();
      visionTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      visionIntervalsRef.current.forEach((intervalId) => {
        window.clearInterval(intervalId);
      });
      visionTimeoutsRef.current = [];
      visionIntervalsRef.current = [];
      statusTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      statusTimeoutsRef.current = [];
      context.revert();
    };
  }, [statusEntries]);

  useEffect(() => {
    const cleanups = glitchLineRefs.current.map((line) => {
      if (!line) {
        return () => {};
      }

      let timeoutId = 0;

      const schedule = () => {
        timeoutId = window.setTimeout(() => {
          if (sectionVisibleRef.current) {
            const widthScale = randomBetween(0.2, 0.92);
            const xShift = randomBetween(-18, 18);
            const yShift = randomBetween(80, sectionRef.current?.clientHeight ?? 400);

            line.classList.add('future-era__glitch-line--active');
            gsap.set(line, { x: xShift, y: yShift, scaleX: widthScale });
            gsap.fromTo(
              line,
              { xPercent: -12 },
              {
                xPercent: 16,
                duration: randomBetween(0.3, 0.7),
                ease: 'power1.inOut',
                onComplete: () => {
                  line.classList.remove('future-era__glitch-line--active');
                  schedule();
                },
              }
            );
            return;
          }

          schedule();
        }, randomBetween(2000, 6000));
      };

      schedule();

      return () => {
        window.clearTimeout(timeoutId);
        gsap.killTweensOf(line);
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  const setVisionRef = (element, index) => {
    visionRefs.current[index] = element;
  };

  const setVisionLabelRef = (element, index) => {
    visionLabelRefs.current[index] = element;
  };

  const setVisionSubRef = (element, index) => {
    visionSubRefs.current[index] = element;
  };

  const setGlitchLineRef = (element, index) => {
    glitchLineRefs.current[index] = element;
  };

  const renderVisionHeadline = (headline, index) => {
    if (!visionResolved[index]) {
      return headline;
    }

    const [firstWord, ...rest] = headline.split(' ');

    return (
      <>
        <span
          className="future-era__glitch-first-word"
          style={{ animationDelay: FUTURE_VISION_ENTRIES[index].glitchDelay }}
        >
          {firstWord}
        </span>{' '}
        {rest.join(' ')}
      </>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="future-era"
      data-era-progress={eraProgress}
      aria-label="Future era"
    >
      <div ref={canvasHostRef} className="future-era__canvas-host" aria-hidden="true" />

      <div className="future-era__glitches" aria-hidden="true">
        {Array.from({ length: GLITCH_LINE_COUNT }).map((_, index) => (
          <div
            key={`glitch-line-${index + 1}`}
            ref={(element) => setGlitchLineRef(element, index)}
            className="future-era__glitch-line"
          />
        ))}
      </div>

      <div className="future-era__content">
        <div className="future-era__monogram">{futureData.monogram}</div>

        <header ref={heroRef} className="future-era__hero">
          <h2 className="future-era__headline">{headlineText}</h2>
          {headlineResolved ? (
            <p className="future-era__subline">
              <TypewriterText
                text={futureData.subline}
                speed={45}
                hideCursorAfterMs={null}
              />
            </p>
          ) : (
            <p className="future-era__subline future-era__subline--placeholder" aria-hidden="true">
              &nbsp;
            </p>
          )}
        </header>

        <section className="future-era__visions" aria-label="Future visions">
          {FUTURE_VISION_ENTRIES.map((vision, index) => (
            <div
              key={vision.id}
              ref={(element) => setVisionRef(element, index)}
              className="future-era__vision-block"
            >
              <p
                ref={(element) => setVisionLabelRef(element, index)}
                className="future-era__vision-label"
              >
                <span className="future-era__vision-label-line" aria-hidden="true" />
                <span>{vision.label}</span>
              </p>
              <h3 className="future-era__vision-title">
                {renderVisionHeadline(visionHeadlines[index], index)}
              </h3>
              <p
                ref={(element) => setVisionSubRef(element, index)}
                className="future-era__vision-desc"
              >
                {vision.sub}
              </p>
            </div>
          ))}
        </section>

        <section ref={statusRef} className="future-era__status" aria-label="Current status">
          <p className="future-era__status-label">// CURRENT STATUS</p>

          <div className="future-era__status-lines">
            {statusEntries.map((entry, index) => (
              <p key={entry.key} className="future-era__status-line">
                {statusLines[index] ? (
                  <TypewriterText
                    text={statusLines[index]}
                    speed={28}
                    hideCursorAfterMs={index === statusEntries.length - 1 ? null : 0}
                  />
                ) : (
                  <span className="future-era__status-placeholder" aria-hidden="true">
                    &nbsp;
                  </span>
                )}
              </p>
            ))}
          </div>
        </section>

        <section ref={ctaRef} className="future-era__cta" aria-label="Contact prompt">
          <p className="future-era__cta-line">{futureData.cta}</p>
          <p className="future-era__cta-arrow">{`\u2193`}</p>
        </section>
      </div>
    </section>
  );
}
