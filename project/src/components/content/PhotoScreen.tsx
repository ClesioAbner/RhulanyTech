import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/*
 * A photo of a device with live content on its screen, the way screen replacements are done in
 * product photography: the four corners of the screen are measured on the photo and a perspective
 * transform (matrix3d) maps a flat element onto them, so it follows the tilt and perspective.
 * Anything that sits in front of the screen in the photo (a thumb) is drawn again on top.
 * Content sizes itself in container units (cqw), relative to the screen's width.
 */

type Point = [number, number];

export interface ScreenPhoto {
  /** Photo size in pixels. */
  width: number;
  height: number;
  /** Screen corners in photo pixels: top-left, top-right, bottom-left, bottom-right. */
  corners: [Point, Point, Point, Point];
  /** Corner radius of the screen, as a share of its width. */
  radius: number;
  /** Shapes in front of the screen (photo pixels), redrawn over the content. */
  occluders?: Point[][];
  /** A cut-out the size of the photo with only what lies in front of the screen (fingers). */
  overlay?: { src: string; srcSet?: string };
}

interface PhotoScreenProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  photo: ScreenPhoto;
  /** Frame width divided by height. */
  aspect: number;
  /** Photo width as a multiple of the frame width; 1 shows the whole width. */
  zoom?: number;
  /** Point of the photo (0–1) placed at the frame point `target` (0–1). */
  focus?: { x: number; y: number };
  target?: { x: number; y: number };
  className?: string;
  children: ReactNode;
}

// ---------- Perspective maths (projective map from a rectangle to four points) ----------

type M3 = number[];
const adj = (m: M3): M3 => [
  m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
  m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
  m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
];
const mul = (a: M3, b: M3): M3 => {
  const c: M3 = [];
  for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) c[3 * i + j] = a[3 * i] * b[j] + a[3 * i + 1] * b[3 + j] + a[3 * i + 2] * b[6 + j];
  return c;
};
const mulV = (m: M3, v: number[]) => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
const basis = (p: Point[]): M3 => {
  const m = [p[0][0], p[1][0], p[2][0], p[0][1], p[1][1], p[2][1], 1, 1, 1];
  const v = mulV(adj(m), [p[3][0], p[3][1], 1]);
  return mul(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
};
/** CSS matrix3d that maps a w × h box onto the corners tl, tr, bl, br. */
const matrix3d = (w: number, h: number, dst: Point[]) => {
  const t = mul(basis(dst), adj(basis([[0, 0], [w, 0], [0, h], [w, h]])));
  const n = t.map((value) => value / t[8]);
  return `matrix3d(${[n[0], n[3], 0, n[6], n[1], n[4], 0, n[7], 0, 0, 1, 0, n[2], n[5], 0, n[8]].join(',')})`;
};

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;
const dist = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1]);

const PhotoScreen = ({
  src,
  srcSet,
  sizes,
  alt,
  photo,
  aspect,
  zoom = 1,
  focus = { x: 0.5, y: 0.5 },
  target = { x: 0.5, y: 0.5 },
  className = '',
  children,
}: PhotoScreenProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(0);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => setFrameWidth(frame.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // Photo box inside the frame, in frame fractions.
  const zoomY = (zoom * aspect) / (photo.width / photo.height);
  const left = target.x - focus.x * zoom;
  const top = target.y - focus.y * zoomY;
  const imageStyle = { left: pct(left), top: pct(top), width: pct(zoom), height: pct(zoomY) };

  // Screen corners in frame pixels, and a flat box the size of the screen's top and left edges.
  const frameHeight = frameWidth / aspect;
  const scale = (zoom * frameWidth) / photo.width;
  const toFrame = ([x, y]: Point): Point => [left * frameWidth + x * scale, top * frameHeight + y * scale];
  const corners = photo.corners.map(toFrame);
  const boxWidth = dist(corners[0], corners[1]);
  const boxHeight = dist(corners[0], corners[2]);

  return (
    <div ref={frameRef} className={`relative overflow-hidden ${className}`} style={{ aspectRatio: String(aspect) }}>
      <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} loading="lazy" className="absolute max-w-none" style={imageStyle} />
      {frameWidth > 0 && (
        <div
          className="absolute left-0 top-0 overflow-hidden [container-type:inline-size]"
          style={{
            width: boxWidth,
            height: boxHeight,
            transformOrigin: '0 0',
            transform: matrix3d(boxWidth, boxHeight, corners),
            borderRadius: boxWidth * photo.radius,
          }}
        >
          {children}
        </div>
      )}
      {photo.occluders?.map((shape, index) => (
        <img
          key={index}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute max-w-none"
          style={{
            ...imageStyle,
            clipPath: `polygon(${shape.map(([x, y]) => `${pct(x / photo.width)} ${pct(y / photo.height)}`).join(', ')})`,
          }}
        />
      ))}
      {photo.overlay && (
        <img
          src={photo.overlay.src}
          srcSet={photo.overlay.srcSet}
          sizes={sizes}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute max-w-none"
          style={imageStyle}
        />
      )}
    </div>
  );
};

export default PhotoScreen;
