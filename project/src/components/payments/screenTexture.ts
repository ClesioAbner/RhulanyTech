import * as THREE from 'three';
import { ScreenPainter } from './screens';

export { SCREEN_W, SCREEN_H, type ScreenKey } from './screens';

/*
 * The screens as a texture on the WebGL phone's display, so they stay glued to the glass, pick up
 * the same lighting and disappear correctly when the phone turns. Painting lives in screens.ts.
 */
export class ScreenRenderer extends ScreenPainter {
  readonly texture: THREE.CanvasTexture;

  constructor() {
    super();
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 8;
  }

  update(now: number) {
    const painted = super.update(now);
    if (painted) this.texture.needsUpdate = true;
    return painted;
  }

  dispose() {
    this.texture.dispose();
  }
}
