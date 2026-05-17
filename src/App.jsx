import { useEffect, useState } from 'react';
import BootSequence from './components/boot/BootSequence';
import ContactSection from './components/contact/ContactSection';
import FutureEra from './components/eras/FutureEra';
import PastEra from './components/eras/PastEra';
import PresentEra from './components/eras/PresentEra';
import ClockDial from './components/ui/ClockDial';
import EraIndicator from './components/ui/EraIndicator';
import FutureCursor from './components/ui/FutureCursor';
import MusicPlayer from './components/ui/MusicPlayer';
import TransitionEffect from './components/ui/TransitionEffect';
import { useEraDetection } from './hooks/useEraDetection';
import { useScrollProgress } from './hooks/useScrollProgress';

const BODY_ERA_CLASSES = ['era-past', 'era-present', 'era-future', 'era-contact'];

function getBodyEraClass(currentEra) {
  if (currentEra === 'past') {
    return 'era-past';
  }

  if (currentEra === 'present') {
    return 'era-present';
  }

  if (currentEra === 'contact') {
    return 'era-contact';
  }

  return 'era-future';
}

export default function App() {
  const [bootDone, setBootDone] = useState(false);
  const { scrollProgress } = useScrollProgress();
  const { currentEra, eraProgress } = useEraDetection(scrollProgress);

  useEffect(() => {
    if (!bootDone) {
      return undefined;
    }

    const bodyEraClass = getBodyEraClass(currentEra);

    // Body classes are the global switchboard for era-level variables like color and typography.
    document.body.classList.remove(...BODY_ERA_CLASSES);
    document.body.classList.add(bodyEraClass);

    return () => {
      document.body.classList.remove(bodyEraClass);
    };
  }, [bootDone, currentEra]);

  if (!bootDone) {
    return <BootSequence onComplete={() => setBootDone(true)} />;
  }

  return (
    <div className="timeline">
      <EraIndicator currentEra={currentEra} />
      <MusicPlayer />
      <ClockDial currentEra={currentEra} scrollProgress={scrollProgress} />
      <TransitionEffect currentEra={currentEra} />
      {currentEra === 'future' ? <FutureCursor /> : null}

      <main className="timeline-scroll">
        <PastEra eraProgress={currentEra === 'past' ? eraProgress : 0} />
        <PresentEra eraProgress={currentEra === 'present' ? eraProgress : 0} />
        <FutureEra
          eraProgress={currentEra === 'future' ? eraProgress : 0}
          isActive={currentEra === 'future'}
        />
        <ContactSection />
      </main>
    </div>
  );
}
