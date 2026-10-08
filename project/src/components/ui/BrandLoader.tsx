import type { CSSProperties } from 'react';

// "Rhulany" in ink and "Tech" quieter, like the logo in the header; each letter carries its place in the wave.
const LETTERS = [...'Rhulany']
  .map((letter) => ({ letter, tech: false }))
  .concat([...'Tech'].map((letter) => ({ letter, tech: true })));

interface BrandLoaderProps {
  /** Height of the letters in px. */
  size?: number;
  /** A thin line sliding under the name, for longer waits (pages, payments). */
  progress?: boolean;
  /** `paper` for dark backgrounds, such as a busy button. */
  tone?: 'ink' | 'paper';
  /**
   * `delayed` (default) fades in only when loading takes a moment, so fast loads never see it;
   * `now` shows at once, for an action the visitor has just taken.
   */
  timing?: 'delayed' | 'now';
}

/**
 * The site's loader: the RhulanyTech logo with a soft wave running through its letters.
 * Its styles (.rt-*) live in index.html, shared with the first-visit loader drawn there.
 * Decorative: the surrounding element says what is loading (role="status" or hidden text).
 */
const BrandLoader = ({ size = 20, progress = false, tone = 'ink', timing = 'delayed' }: BrandLoaderProps) => (
  <span
    className={`rt-loader ${timing === 'now' ? 'rt-loader--now' : ''} ${tone === 'paper' ? 'rt-loader--paper' : ''}`}
    style={{ '--rt-size': `${size}px` } as CSSProperties}
    aria-hidden="true"
  >
    <span className="rt-logo">
      {LETTERS.map(({ letter, tech }, index) => (
        <span key={index} className={tech ? 'rt-logo-tech' : undefined} style={{ '--i': index } as CSSProperties}>
          {letter}
        </span>
      ))}
    </span>
    {progress && <span className="rt-progress" />}
  </span>
);

export default BrandLoader;

/** Inside a dark button that is busy: the logo in light tones, with the action spelt out for screen readers. */
export const ButtonLoader = ({ label }: { label: string }) => (
  <>
    <BrandLoader size={14} tone="paper" timing="now" />
    <span className="sr-only">{label}</span>
  </>
);
