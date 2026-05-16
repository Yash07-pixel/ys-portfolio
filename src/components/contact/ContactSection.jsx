import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { siGithub } from 'simple-icons';
import { futureData } from '../../data/future';

function hasLink(url) {
  return Boolean(url) && !url.includes('[add link]');
}

function ContactIcon({ kind }) {
  if (kind === 'email') {
    return (
      <svg
        className="contact-section__action-svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25zm1.8.03 7.2 5.3 7.2-5.3a.74.74 0 0 0-.45-.16H5.25a.74.74 0 0 0-.45.16m14.7 1.88-7.06 5.2a.75.75 0 0 1-.89 0l-7.05-5.2v8.6c0 .41.33.74.75.74h14.5c.42 0 .75-.33.75-.75z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (kind === 'linkedin') {
    return (
      <span className="contact-section__action-badge" aria-hidden="true">
        in
      </span>
    );
  }

  if (kind === 'resume') {
    return (
      <svg
        className="contact-section__action-svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M7 3.75A1.75 1.75 0 0 1 8.75 2h5.69c.46 0 .9.18 1.22.5l3.84 3.84c.32.32.5.76.5 1.22v12.69A1.75 1.75 0 0 1 18.25 22H8.75A1.75 1.75 0 0 1 7 20.25zm8 1.81V7h1.44zM8.75 3.5a.25.25 0 0 0-.25.25v16.5c0 .14.11.25.25.25h9.5c.14 0 .25-.11.25-.25V8.5h-2.75A1.75 1.75 0 0 1 14 6.75V4zm1.75 7.75h5v1.5h-5zm0 3h5.5v1.5h-5.5zm0 3H14v1.5h-3.5z"
          fill="currentColor"
        />
      </svg>
    );
  }

  const icons = {
    github: siGithub,
  };

  const icon = icons[kind];

  if (!icon) {
    return null;
  }

  return (
    <svg
      className="contact-section__action-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

export default function ContactSection() {
  const sectionRef = useRef(null);
  const monogramRef = useRef(null);
  const photoRef = useRef(null);
  const nameRef = useRef(null);
  const messageRef = useRef(null);
  const badgeRef = useRef(null);
  const linkRefs = useRef([]);
  const dividerRef = useRef(null);
  const footerRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const animateSection = () => {
      // The monogram opens first like a closing title card before the personal note resolves underneath.
      gsap.fromTo(
        monogramRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: 'power2.out' }
      );

      gsap.fromTo(
        photoRef.current,
        { opacity: 0, y: 18, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          delay: 0.2,
          ease: 'power2.out',
        }
      );

      gsap.fromTo(
        nameRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: 'power2.out' }
      );

      gsap.fromTo(
        messageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.7, ease: 'power2.out' }
      );

      gsap.fromTo(
        badgeRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: 1, ease: 'power2.out' }
      );

      gsap.fromTo(
        linkRefs.current.filter(Boolean),
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 1.2,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );

      gsap.fromTo(
        [dividerRef.current, footerRef.current],
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 1.6,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateSection();
          observerRef.current?.disconnect();
        });
      },
      { threshold: 0.25 }
    );

    observerRef.current.observe(section);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  const setLinkRef = (element, index) => {
    linkRefs.current[index] = element;
  };

  const links = [
    {
      kind: 'email',
      label: 'Email',
      href: `mailto:${futureData.contact.email}`,
      external: true,
      disabled: false,
    },
    {
      kind: 'linkedin',
      label: 'LinkedIn',
      href: futureData.contact.linkedin,
      external: true,
      disabled: !hasLink(futureData.contact.linkedin),
    },
    {
      kind: 'github',
      label: 'GitHub',
      href: futureData.contact.github,
      external: true,
      disabled: !hasLink(futureData.contact.github),
    },
    {
      kind: 'resume',
      label: 'Resume',
      href: futureData.contact.Resume,
      external: true,
      disabled: !hasLink(futureData.contact.Resume),
    },
  ];

  return (
    <section ref={sectionRef} className="contact-section" aria-label="Contact section">
      <div ref={monogramRef} className="contact-section__monogram">
        <span className="contact-section__monogram-layer contact-section__monogram-layer--gold">
          YS
        </span>
        <span className="contact-section__monogram-layer contact-section__monogram-layer--cyan">
          YS
        </span>
        <span className="contact-section__monogram-layer contact-section__monogram-layer--magenta">
          YS
        </span>
      </div>

      <div ref={photoRef} className="contact-section__photo-frame">
        <img
          className="contact-section__photo"
          src="/yash-photo.jpeg"
          alt="Yash Sharma"
        />
      </div>

      <h2 ref={nameRef} className="contact-section__name">
        {futureData.contact.name}
      </h2>

      <div ref={messageRef} className="contact-section__message">
        <p>
          {futureData.contact.message[0]}
          <strong>{futureData.contact.message[1]}</strong>
          {futureData.contact.message[2]}
        </p>
        <p>
          {futureData.contact.message[4]}
          <strong>{futureData.contact.message[5]}</strong>
          {futureData.contact.message[6]}
        </p>
      </div>

      <div ref={badgeRef} className="contact-section__badge">
        <span className="contact-section__badge-dot" aria-hidden="true" />
        <span>{futureData.contact.availability}</span>
      </div>

      <div className="contact-section__links">
        {links.map((link, index) =>
          link.disabled ? (
            <span
              key={link.label}
              ref={(element) => setLinkRef(element, index)}
              className="contact-section__action contact-section__action--disabled"
              aria-label={`${link.label} link pending`}
            >
              <span className="contact-section__action-icon" aria-hidden="true">
                <ContactIcon kind={link.kind} />
              </span>
              <span>{link.label}</span>
            </span>
          ) : (
            <a
              key={link.label}
              ref={(element) => setLinkRef(element, index)}
              className="contact-section__action"
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
            >
              <span className="contact-section__action-icon" aria-hidden="true">
                <ContactIcon kind={link.kind} />
              </span>
              <span>{link.label}</span>
            </a>
          )
        )}
      </div>

      <div ref={dividerRef} className="contact-section__divider" aria-hidden="true" />

      <p ref={footerRef} className="contact-section__footer">
        {futureData.contact.footer}
      </p>
    </section>
  );
}
