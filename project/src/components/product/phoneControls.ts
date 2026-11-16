/**
 * A phone's physical buttons, seen from the front: where each one starts and ends down the side,
 * as a share of the body's height. `camera` is the flush sapphire Camera Control of recent iPhones.
 */
export interface PhoneControls {
  left?: [number, number][];
  right?: [number, number][];
  camera?: [number, number];
}

/** iPhone 17 Pro and 18 Pro: Action button and volume on the left; side button and Camera Control on the right. */
export const IPHONE_PRO: PhoneControls = {
  left: [
    [0.205, 0.245],
    [0.29, 0.355],
    [0.375, 0.44],
  ],
  right: [[0.27, 0.37]],
  camera: [0.56, 0.62],
};

/** iPhone Air: the same layout on a thinner body. */
export const IPHONE_AIR: PhoneControls = {
  left: [
    [0.2, 0.236],
    [0.28, 0.34],
    [0.36, 0.42],
  ],
  right: [[0.26, 0.355]],
  camera: [0.545, 0.6],
};

/** Galaxy S26 Ultra: volume rocker, then the side key, both on the right. */
export const GALAXY_ULTRA: PhoneControls = {
  right: [
    [0.25, 0.36],
    [0.39, 0.45],
  ],
};

/** Pixel 9 Pro: power, then the volume rocker, on the right. */
export const PIXEL_PRO: PhoneControls = {
  right: [
    [0.24, 0.3],
    [0.33, 0.44],
  ],
};
