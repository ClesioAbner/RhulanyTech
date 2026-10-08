import { useEffect, useRef, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';
import { isCutout } from '../../lib/images';
import { isImageReady } from '../../lib/useImageReady';
import BrandLoader from '../ui/BrandLoader';

interface ProductImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  /** Inset around a cut-out, as a Tailwind padding class; photos always fill the frame. */
  inset?: string;
  /** Show the logo loader until the photo arrives, then fade the photo in (shop pictures). */
  loader?: boolean;
}

/*
 * A product picture inside a positioned frame. Studio cut-outs are shown whole and centred with a
 * soft shadow, the way brand stores show their products; regular photos fill the frame.
 */
const ProductImage = ({
  src,
  alt = '',
  inset = 'p-[11%]',
  className = '',
  loader = false,
  onLoad,
  onError,
  ...rest
}: ProductImageProps) => {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(() => !loader || isImageReady(src));

  const holder = useRef<HTMLSpanElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  // A new photo starts hidden unless it is already in; a cached one can finish before React attaches onLoad.
  useEffect(() => {
    setLoaded(!loader || Boolean(ref.current?.complete && ref.current.naturalWidth));
  }, [src, loader]);

  // The chip's short delay counts from when the card scrolls into view, so a photo that arrives on time never flashes it.
  useEffect(() => {
    const element = holder.current;
    if (!element || loaded) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setOnScreen(true);
      observer.disconnect();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [loaded]);

  const fade = loader ? `transition-opacity duration-700 ease-out-expo ${loaded ? 'opacity-100' : 'opacity-0'}` : '';
  const imageProps = {
    ref,
    src,
    alt,
    draggable: false,
    onLoad: (event: SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true);
      onLoad?.(event);
    },
    onError: (event: SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true);
      onError?.(event);
    },
    ...rest,
  };

  return (
    <>
      {loader && !loaded && (
        <span ref={holder} className="absolute inset-0 grid place-items-center" aria-hidden="true">
          {onScreen && <BrandLoader size={13} />}
        </span>
      )}
      {isCutout(src) ? (
        <span className={`absolute inset-0 block ${inset}`}>
          <img {...imageProps} className={`stage-shadow h-full w-full object-contain ${fade} ${className}`} />
        </span>
      ) : (
        <img {...imageProps} className={`absolute inset-0 h-full w-full object-cover ${fade} ${className}`} />
      )}
    </>
  );
};

export default ProductImage;
