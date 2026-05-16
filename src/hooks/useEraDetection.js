import { useEffect, useMemo, useState } from 'react';

const ERA_RANGES = {
  past: { start: 0, end: 0.35 },
  present: { start: 0.35, end: 0.65 },
  future: { start: 0.65, end: 0.95 },
  contact: { start: 0.95, end: 1 },
};

const ERA_SELECTORS = {
  past: '.past-era',
  present: '.present-era',
  future: '.future-era',
  contact: '.contact-section',
};

function getEraProgress(progress, start, end) {
  const span = end - start;

  if (span <= 0) {
    return 0;
  }

  return Math.min(Math.max((progress - start) / span, 0), 1);
}

function getEraFromProgress(progress) {
  if (progress < ERA_RANGES.past.end) {
    return 'past';
  }

  if (progress < ERA_RANGES.present.end) {
    return 'present';
  }

  if (progress < ERA_RANGES.future.end) {
    return 'future';
  }

  return 'contact';
}

export function useEraDetection(scrollProgress) {
  const safeProgress = Math.min(Math.max(scrollProgress, 0), 1);
  const [currentEra, setCurrentEra] = useState(() => getEraFromProgress(safeProgress));
  const [sectionEraProgress, setSectionEraProgress] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const probeY = window.innerHeight * 0.42;
    const sections = Object.entries(ERA_SELECTORS)
      .map(([era, selector]) => {
        const element = document.querySelector(selector);

        if (!element) {
          return null;
        }

        return { era, rect: element.getBoundingClientRect() };
      })
      .filter(Boolean);

    if (!sections.length) {
      setCurrentEra(getEraFromProgress(safeProgress));
      setSectionEraProgress(null);
      return;
    }

    const sectionAtProbe =
      sections.find(({ rect }) => rect.top <= probeY && rect.bottom >= probeY) ??
      sections.reduce((closest, section) => {
        if (!closest) {
          return section;
        }

        const closestDistance = Math.min(
          Math.abs(closest.rect.top - probeY),
          Math.abs(closest.rect.bottom - probeY)
        );
        const nextDistance = Math.min(
          Math.abs(section.rect.top - probeY),
          Math.abs(section.rect.bottom - probeY)
        );

        return nextDistance < closestDistance ? section : closest;
      }, null);

    if (!sectionAtProbe) {
      setCurrentEra(getEraFromProgress(safeProgress));
      setSectionEraProgress(null);
      return;
    }

    const progressWithinSection = Math.min(
      Math.max((probeY - sectionAtProbe.rect.top) / Math.max(sectionAtProbe.rect.height, 1), 0),
      1
    );

    setCurrentEra(sectionAtProbe.era);
    setSectionEraProgress(progressWithinSection);
  }, [safeProgress]);

  const eraProgress = useMemo(() => {
    if (sectionEraProgress !== null) {
      return sectionEraProgress;
    }

    const range = ERA_RANGES[currentEra];
    return getEraProgress(safeProgress, range.start, range.end);
  }, [currentEra, safeProgress, sectionEraProgress]);

  return { currentEra, eraProgress };
}

export default useEraDetection;
