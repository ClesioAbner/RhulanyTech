import type { ScreenPhoto } from '../PhotoScreen';

export const SOFA: ScreenPhoto = {
  width: 1200,
  height: 1500,
  corners: [
    [605, 330],
    [812, 348],
    [549, 783],
    [756, 804],
  ],
  radius: 0.11,
  // The right thumb rests over the lower right of the screen.
  occluders: [
    [
      [773, 540],
      [778, 522],
      [788, 514],
      [801, 512],
      [815, 516],
      [832, 530],
      [870, 560],
      [870, 880],
      [722, 880],
      [728, 830],
      [735, 800],
      [742, 775],
      [750, 740],
      [757, 700],
      [764, 660],
      [770, 610],
    ],
  ],
};

// The hand holds an older phone; an iPhone Air is drawn over its whole body (outline measured on the
// photo), and the fingers touching its sides are laid back on top from a cut-out of the same photo.
export const HAND: ScreenPhoto = {
  width: 1400,
  height: 902,
  corners: [
    [787, 101],
    [1108, 101],
    [787, 761],
    [1108, 761],
  ],
  radius: 0.11,
  overlay: {
    src: '/images/blog/telemovel-mao-dedos-1400.webp',
    srcSet: '/images/blog/telemovel-mao-dedos-800.webp 800w, /images/blog/telemovel-mao-dedos-1400.webp 1400w',
  },
};

/*
 * Free photos (CC0, StockSnap, "Design by Matt"): a hand holding a phone with its screen off.
 * Corners are the display area, measured on the 960 × 1440 photo: the glass edges were traced and
 * the bezel taken off, so the content never spills onto the frame.
 */

// Held straight on; the fingers stay on the frame, so nothing covers the display.
export const FRONT: ScreenPhoto = {
  width: 960,
  height: 1440,
  corners: [
    [338.8, 250.3],
    [613.7, 249.9],
    [338.8, 886.7],
    [613.7, 886.6],
  ],
  radius: 0.11,
};

// Turned and tilted; the tip of the thumb and the base of the hand rest over the left of the display.
export const TILTED: ScreenPhoto = {
  width: 960,
  height: 1440,
  corners: [
    [347.4, 339.4],
    [572.4, 316.6],
    [421.6, 937.3],
    [656.5, 904.2],
  ],
  radius: 0.11,
  occluders: [
    [
      [300, 520],
      [355, 535],
      [361, 540],
      [367.5, 550],
      [372.5, 560],
      [377.5, 575],
      [381, 590],
      [383.8, 605],
      [385.5, 625],
      [384, 640],
      [380, 648],
      [376, 670],
      [375, 700],
      [376, 725],
      [380, 745],
      [382.5, 755],
      [395, 780],
      [401, 800],
      [407.5, 820],
      [416, 840],
      [421, 850],
      [427.5, 875],
      [433.8, 900],
      [441, 930],
      [444, 945],
      [446, 965],
      [446, 1010],
      [300, 1010],
    ],
  ],
};
