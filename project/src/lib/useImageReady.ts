import { useEffect, useState } from 'react';

/** True when the browser already holds this image, so it can be shown without a loading state. */
export const isImageReady = (src: string) => {
  const probe = new Image();
  probe.src = src;
  return probe.complete && probe.naturalWidth > 0;
};

/**
 * Whether an image has arrived; a failed image counts as done, so nothing waits on it forever.
 * The answer always belongs to the current `src`: when it changes, the last image's "ready" is not
 * carried over for a render (which would show the new content, then hide it while it loads).
 */
export const useImageReady = (src: string) => {
  const [arrived, setArrived] = useState<string | null>(() => (isImageReady(src) ? src : null));

  useEffect(() => {
    if (isImageReady(src)) {
      setArrived(src);
      return;
    }
    const image = new Image();
    image.onload = image.onerror = () => setArrived(src);
    image.src = src;
    return () => {
      image.onload = image.onerror = null;
    };
  }, [src]);

  return arrived === src || isImageReady(src);
};
