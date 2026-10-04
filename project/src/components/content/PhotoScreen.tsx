import type { CSSProperties, ReactNode } from 'react';

/*
 * A photo of a device with live content placed on its screen.
 *
 * The screen is described in the photo's own pixels (centre, size, tilt), and the frame shows the
 * photo at a given zoom with a focal point, so the overlay lands on the screen at any width.
 * Content sizes itself in container units (cqw), relative to the screen's width.
 */

export interface ScreenGeometry {
  /** Photo size in pixels. */
  width: number;
  height: number;
  /** Screen centre and size in photo pixels, and its tilt in degrees. */
  cx: number;
  cy: number;
  w: number;
  h: number;
  rotate?: number;
}

interface PhotoScreenProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  geometry: ScreenGeometry;
  /** Frame width divided by height. */
  aspect: number;
  /** Photo width as a multiple of the frame width; 1 shows the whole width. */
  zoom?: number;
  /** Point of the photo (0–1) placed at the frame point `target` (0–1). */
  focus?: { x: number; y: number };
  target?: { x: number; y: number };
  className?: string;
  imgClassName?: string;
  children: ReactNode;
}

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;

const PhotoScreen = ({
  src,
  srcSet,
  sizes,
  alt,
  geometry: g,
  aspect,
  zoom = 1,
  focus = { x: 0.5, y: 0.5 },
  target = { x: 0.5, y: 0.5 },
  className = '',
  imgClassName = '',
  children,
}: PhotoScreenProps) => {
  const photoAspect = g.width / g.height;
  // Photo size relative to the frame: width in frame widths, height in frame heights.
  const zoomY = (zoom * aspect) / photoAspect;
  const left = target.x - focus.x * zoom;
  const top = target.y - focus.y * zoomY;

  const imageStyle: CSSProperties = { left: pct(left), top: pct(top), width: pct(zoom), height: pct(zoomY) };
  const screenStyle: CSSProperties = {
    left: pct(left + zoom * ((g.cx - g.w / 2) / g.width)),
    top: pct(top + zoomY * ((g.cy - g.h / 2) / g.height)),
    width: pct(zoom * (g.w / g.width)),
    height: pct(zoomY * (g.h / g.height)),
    transform: g.rotate ? `rotate(${g.rotate}deg)` : undefined,
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: String(aspect) }}>
      <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} loading="lazy" className={`absolute max-w-none ${imgClassName}`} style={imageStyle} />
      <div className="absolute [container-type:inline-size]" style={screenStyle}>
        {children}
      </div>
    </div>
  );
};

export default PhotoScreen;
