import { useEffect, useState } from 'react';
import { useMediaQuery } from '../../lib/useMediaQuery';

// Below this, scrolling down doesn't hide the button (the top of the page is never crowded).
const HIDE_AFTER = 240;
// Ignore tiny movements, so a resting thumb doesn't make the button flicker.
const MIN_SCROLL = 6;

/*
 * Phones and tablets: the chat button keeps clear of the page's own controls at the bottom.
 * It sits above a fixed buy bar ([data-buy-bar]), steps aside while the page's main purchase
 * buttons ([data-keep-clear]) are on screen, and moves out of the way while the visitor scrolls
 * down the page, coming back as soon as they scroll up.
 */
export const useBottomControls = () => {
  const compact = useMediaQuery('(max-width: 1023px)');
  const [raised, setRaised] = useState(false);
  const [keepClear, setKeepClear] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);

  useEffect(() => {
    if (!compact) {
      setRaised(false);
      setKeepClear(false);
      return;
    }
    const visible = new Set<Element>();
    const watcher = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
      setKeepClear(visible.size > 0);
    });
    let watched: Element[] = [];
    let frame = 0;

    // Pages and bars come and go, so look again whenever the page changes shape.
    const scan = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setRaised(Boolean(document.querySelector('[data-buy-bar]')));
        const targets = [...document.querySelectorAll('[data-keep-clear]')];
        watched
          .filter((element) => !targets.includes(element))
          .forEach((element) => {
            watcher.unobserve(element);
            visible.delete(element);
          });
        targets.filter((element) => !watched.includes(element)).forEach((element) => watcher.observe(element));
        watched = targets;
        setKeepClear(visible.size > 0);
      });
    };
    const changes = new MutationObserver(scan);
    changes.observe(document.body, { childList: true, subtree: true });
    scan();

    return () => {
      cancelAnimationFrame(frame);
      changes.disconnect();
      watcher.disconnect();
    };
  }, [compact]);

  useEffect(() => {
    if (!compact) {
      setScrollingDown(false);
      return;
    }
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - last) < MIN_SCROLL) return;
        setScrollingDown(y > last && y > HIDE_AFTER);
        last = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [compact]);

  return { raised, stepAside: keepClear || scrollingDown };
};
