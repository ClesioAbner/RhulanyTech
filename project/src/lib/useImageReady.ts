import { useEffect, useState } from 'react';

/** True when the browser already holds this image, so it can be shown without a loading state. */
export const isImageReady = (src: string) => {
  const probe = new Image();
  probe.src = src;
  return probe.complete && probe.naturalWidth > 0;
};

/** Whether an image has arrived; a failed image counts as done, so nothing waits on it forever. */
export const useImageReady = (src: string) => {
  const [ready, setReady] = useState(() => isImageReady(src));

  useEffect(() => {
    if (isImageReady(src)) {
      setReady(true);
      return;
    }
    setReady(false);
    const image = new Image();
    image.onload = image.onerror = () => setReady(true);
    image.src = src;
    return () => {
      image.onload = image.onerror = null;
    };
  }, [src]);

  return ready;
};
