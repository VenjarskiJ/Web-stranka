import { motion, useInView, useReducedMotion } from 'framer-motion';
import { type ReactNode, useEffect, useRef, useState } from 'react';

const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>[]{}';

export function DecodeText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });
  const shouldReduceMotion = useReducedMotion();
  const [rendered, setRendered] = useState(shouldReduceMotion ? text : text.replace(/[^\s]/g, '·'));

  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      if (shouldReduceMotion) setRendered(text);
      return;
    }

    let frame = 0;
    const totalFrames = Math.max(18, text.length * 1.6);
    const timer = window.setInterval(() => {
      frame += 1;
      const revealed = Math.floor(text.length * frame / totalFrames);
      setRendered(
        text
          .split('')
          .map((character, index) => {
            if (character === ' ') return ' ';
            if (index < revealed) return character;
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join(''),
      );
      if (frame >= totalFrames) {
        window.clearInterval(timer);
        setRendered(text);
      }
    }, 28);

    return () => window.clearInterval(timer);
  }, [isInView, shouldReduceMotion, text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{rendered}</span>
    </span>
  );
}

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 34, filter: 'blur(12px)' }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="section-heading">
      <div className="section-heading__signal" aria-hidden="true">
        <span>{index}</span>
        <i />
      </div>
      <div>
        <p className="section-heading__eyebrow">{eyebrow}</p>
        <h2><DecodeText text={title} /></h2>
        {description && <p className="section-heading__description">{description}</p>}
      </div>
    </Reveal>
  );
}
