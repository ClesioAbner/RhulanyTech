import { useEffect, useState } from 'react';
import { useMediaQuery } from '../../lib/useMediaQuery';

/*
 * Phones and tablets: the chat button keeps clear of the page's own controls at the bottom.
 * It sits above a fixed buy bar ([data-buy-bar]) and steps aside while the page's main purchase
 * buttons ([data-keep-clear]) are on screen, so it never covers a way to buy.
 */
export const useBottomControls = () => {
  const compact = useMediaQuery('(max-width: 1023px)');
  const [raised, setRaised] = useState(false);
  const [stepAside, setStepAside] = useState(false);

  useEffect(() => {
    if (!compact) {
      setRaised(false);
      setStepAside(false);
      return;
    }
    const visible = new Set<Element>();
    const watcher = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
      setStepAside(visible.size > 0);
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
        setStepAside(visible.size > 0);
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

  return { raised, stepAside };
};
