const UNSPLASH = 'https://images.unsplash.com/photo-';
const WIDTHS = [480, 800, 1200, 1600, 2200];

/*
 * Our own photography lives in public/images as pre-sized files: "/images/blog/name" stands for
 * name-900.jpg and name-1600.jpg. Everything else is an Unsplash id resized on their CDN.
 *
 * Product cut-outs (transparent, shot from the back on a clean background) live in
 * /images/produtos as name-600.webp and name-1200.webp, sized by height.
 */
const LOCAL_WIDTHS = [900, 1600];
const PRODUCT_DIR = '/images/produtos/';
const PRODUCT_SIZES = [600, 1200];
const isLocal = (id: string) => id.startsWith('/');
const isFile = (id: string) => /\.\w{3,4}$/.test(id);

const localFile = (id: string, width: number) => {
  if (isFile(id)) return id;
  if (id.startsWith(PRODUCT_DIR)) return `${id}-${width <= 700 ? PRODUCT_SIZES[0] : PRODUCT_SIZES[1]}.webp`;
  return `${id}-${LOCAL_WIDTHS.find((w) => w >= width) ?? LOCAL_WIDTHS[LOCAL_WIDTHS.length - 1]}.jpg`;
};

/** True for transparent product cut-outs, which are shown whole (contain) on a studio background. */
export const isCutout = (src?: string) => Boolean(src?.includes(PRODUCT_DIR));

export const unsplash = (id: string, width = 1200) =>
  isLocal(id) ? localFile(id, width) : `${UNSPLASH}${id}?auto=format&fit=crop&w=${width}&q=80`;

export const unsplashSrcSet = (id: string) =>
  isLocal(id)
    ? id.startsWith(PRODUCT_DIR)
      ? PRODUCT_SIZES.map((h) => `${id}-${h}.webp ${h}w`).join(', ')
      : LOCAL_WIDTHS.map((w) => `${id}-${w}.jpg ${w}w`).join(', ')
    : WIDTHS.map((w) => `${unsplash(id, w)} ${w}w`).join(', ');
