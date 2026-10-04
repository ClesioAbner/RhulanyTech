const UNSPLASH = 'https://images.unsplash.com/photo-';
const WIDTHS = [480, 800, 1200, 1600, 2200];

/*
 * Our own photography lives in public/images as pre-sized files: "/images/blog/name" stands for
 * name-900.jpg and name-1600.jpg. Everything else is an Unsplash id resized on their CDN.
 */
const LOCAL_WIDTHS = [900, 1600];
const isLocal = (id: string) => id.startsWith('/');
const localFile = (id: string, width: number) => `${id}-${LOCAL_WIDTHS.find((w) => w >= width) ?? LOCAL_WIDTHS[LOCAL_WIDTHS.length - 1]}.jpg`;

export const unsplash = (id: string, width = 1200) =>
  isLocal(id) ? localFile(id, width) : `${UNSPLASH}${id}?auto=format&fit=crop&w=${width}&q=80`;

export const unsplashSrcSet = (id: string) =>
  isLocal(id)
    ? LOCAL_WIDTHS.map((w) => `${id}-${w}.jpg ${w}w`).join(', ')
    : WIDTHS.map((w) => `${unsplash(id, w)} ${w}w`).join(', ');
