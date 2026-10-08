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
