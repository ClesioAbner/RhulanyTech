import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';
import { ScreenRenderer, type ScreenKey } from './screenTexture';

/*
 * A real-time 3D iPhone 16 Pro Max (Desert Titanium), built from geometry rather than a downloaded model.
 * Units: phone width = 1. Proportions follow the 163 x 77.6 x 8.25 mm body.
 * The display is a canvas texture (see screenTexture.ts) on a mesh under the front glass, so it stays
 * glued to the body, shares its lighting and hides naturally when the phone turns.
 */

const WIDTH = 1;
const HEIGHT = 2.1;
const DEPTH = 0.106;
const CORNER = 0.17;
const BEZEL = 0.035;
const DISPLAY_W = WIDTH - BEZEL * 2;
const DISPLAY_H = HEIGHT - BEZEL * 2;
const DISPLAY_CORNER = CORNER - BEZEL;

// Camera framing: the canvas is CANVAS_SCALE times the phone's CSS box, so the phone can turn without clipping.
export const CANVAS_SCALE = { x: 2.4, y: 1.35 };
const FOV = 25;

const TITANIUM = '#bba98f';
const BACK_GLASS = '#cdbca4';

const roundedRect = (w: number, h: number, r: number) => {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
};

const Lens = ({ position, ring = TITANIUM }: { position: [number, number, number]; ring?: string }) => (
  <group position={position} rotation={[Math.PI / 2, 0, 0]}>
    {/* titanium ring */}
    <mesh>
      <cylinderGeometry args={[0.108, 0.112, 0.045, 48]} />
      <meshPhysicalMaterial color={ring} metalness={1} roughness={0.28} />
    </mesh>
    {/* glass */}
    <mesh position={[0, 0.019, 0]}>
      <cylinderGeometry args={[0.085, 0.085, 0.004, 48]} />
      <meshPhysicalMaterial color="#05070c" metalness={0.6} roughness={0.05} clearcoat={1} clearcoatRoughness={0.02} />
    </mesh>
    {/* inner element */}
    <mesh position={[0, 0.0215, 0]}>
      <cylinderGeometry args={[0.038, 0.038, 0.002, 32]} />
      <meshPhysicalMaterial color="#2a2f5a" metalness={0.9} roughness={0.15} iridescence={1} iridescenceIOR={1.6} />
    </mesh>
  </group>
);

interface PhoneModelProps {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  rotateZ?: MotionValue<number>;
  /** Applied inside the scene: scaling the canvas element with CSS would desync the projected screen. */
  scale?: MotionValue<number>;
  /** Shifts the model inside the frame, in phone widths (used to centre the camera detail). */
  offsetX?: MotionValue<number>;
  offsetY?: MotionValue<number>;
  /** Titanium and back-glass tints for the selected finish. */
  finish?: { frame: string; back: string };
  screen: ScreenKey;
  lockStage: number;
}

// ShapeGeometry UVs are in shape units; remap them to 0..1 so the texture fills the display.
const normaliseUVs = (geometry: THREE.BufferGeometry, width: number, height: number) => {
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    uv.setXY(i, position.getX(i) / width + 0.5, position.getY(i) / height + 0.5);
  }
  uv.needsUpdate = true;
  return geometry;
};

const PhoneModel = ({ rotateX, rotateY, rotateZ, scale, offsetX, offsetY, finish, screen, lockStage }: PhoneModelProps) => {
  const frame = finish?.frame ?? TITANIUM;
  const backGlass = finish?.back ?? BACK_GLASS;
  const group = useRef<THREE.Group>(null);
  const renderer = useMemo(() => new ScreenRenderer(), []);

  useEffect(() => () => renderer.dispose(), [renderer]);
  useEffect(() => {
    renderer.setScreen(screen, lockStage, performance.now());
  }, [renderer, screen, lockStage]);

  const geometry = useMemo(() => {
    const bevel = 0.022;
    const body = new THREE.ExtrudeGeometry(roundedRect(WIDTH - bevel * 2, HEIGHT - bevel * 2, CORNER - bevel), {
      depth: DEPTH - bevel * 2,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 8,
      curveSegments: 32,
    });
    body.center();
    const front = new THREE.ShapeGeometry(roundedRect(WIDTH - 0.018, HEIGHT - 0.018, CORNER - 0.01), 32);
    const back = new THREE.ShapeGeometry(roundedRect(WIDTH - 0.03, HEIGHT - 0.03, CORNER - 0.015), 32);
    const plateau = new THREE.ExtrudeGeometry(roundedRect(0.5, 0.5, 0.12), {
      depth: 0.012,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 6,
      curveSegments: 24,
    });
    const display = normaliseUVs(
      new THREE.ShapeGeometry(roundedRect(DISPLAY_W, DISPLAY_H, DISPLAY_CORNER), 32),
      DISPLAY_W,
      DISPLAY_H,
    );
    return { body, front, back, plateau, display };
  }, []);

  useFrame(() => {
    if (!group.current) return;
    const rx = THREE.MathUtils.degToRad(rotateX.get());
    const ry = THREE.MathUtils.degToRad(rotateY.get());
    const rz = THREE.MathUtils.degToRad(rotateZ?.get() ?? 0);
    // CSS rotations (y axis pointing down) mapped to three.js (y axis pointing up).
    group.current.rotation.set(-rx, ry, -rz);
    group.current.scale.setScalar(scale?.get() ?? 1);
    group.current.position.set(offsetX?.get() ?? 0, offsetY?.get() ?? 0, 0);
    renderer.update(performance.now());
  });

  const backZ = -DEPTH / 2;
  const frontZ = DEPTH / 2;

  return (
    <group ref={group}>
      {/* Titanium body */}
      <mesh geometry={geometry.body}>
        <meshPhysicalMaterial color={frame} metalness={1} roughness={0.3} clearcoat={0.4} clearcoatRoughness={0.3} />
      </mesh>

      {/* Front glass */}
      <mesh geometry={geometry.front} position={[0, 0, frontZ + 0.0015]}>
        <meshPhysicalMaterial color="#030304" metalness={0.2} roughness={0.06} clearcoat={1} clearcoatRoughness={0.03} />
      </mesh>

      {/* Back glass, matte */}
      <mesh geometry={geometry.back} position={[0, 0, backZ - 0.0015]} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial color={backGlass} metalness={0.15} roughness={0.55} clearcoat={0.5} clearcoatRoughness={0.6} />
      </mesh>

      {/* Camera plateau and lenses (back, top-left as seen from behind) */}
      <group position={[0.19, 0.73, backZ - 0.002]} rotation={[0, Math.PI, 0]}>
        <mesh geometry={geometry.plateau} position={[0, 0, 0]}>
          <meshPhysicalMaterial color={backGlass} metalness={0.35} roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} />
        </mesh>
        <Lens position={[-0.115, 0.115, 0.045]} ring={frame} />
        <Lens position={[-0.115, -0.115, 0.045]} ring={frame} />
        <Lens position={[0.12, 0, 0.045]} ring={frame} />
        <mesh position={[0.135, 0.16, 0.036]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.01, 32]} />
          <meshPhysicalMaterial color="#f6ead2" roughness={0.2} emissive="#3a2f1c" />
        </mesh>
        <mesh position={[0.135, -0.165, 0.036]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.01, 32]} />
          <meshPhysicalMaterial color="#0b0c10" roughness={0.1} metalness={0.5} />
        </mesh>
      </group>

      {/* Side buttons */}
      {[
        { y: 0.6, h: 0.09, side: -1 },
        { y: 0.42, h: 0.17, side: -1 },
        { y: 0.2, h: 0.17, side: -1 },
        { y: 0.36, h: 0.24, side: 1 },
        { y: -0.28, h: 0.15, side: 1 },
      ].map((button) => (
        <RoundedBox
          key={`${button.side}-${button.y}`}
          args={[0.02, button.h, 0.045]}
          radius={0.008}
          smoothness={4}
          position={[(WIDTH / 2 + 0.004) * button.side, button.y, 0]}
        >
          <meshPhysicalMaterial color={frame} metalness={1} roughness={0.35} />
        </RoundedBox>
      ))}

      {/* Display: emissive canvas texture, then a thin glossy layer for glass reflections */}
      <mesh geometry={geometry.display} position={[0, 0, frontZ + 0.0025]}>
        <meshBasicMaterial map={renderer.texture} toneMapped={false} />
      </mesh>
      <mesh geometry={geometry.display} position={[0, 0, frontZ + 0.0035]}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          roughness={0.04}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.02}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const StudioLights = () => (
  <Environment resolution={256} frames={1}>
    <Lightformer form="rect" intensity={3} position={[0, 4, 6]} scale={[10, 3, 1]} />
    <Lightformer form="rect" intensity={2.2} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 10, 1]} />
    <Lightformer form="rect" intensity={1.6} position={[6, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 10, 1]} color="#ffe2c4" />
    <Lightformer form="rect" intensity={1.2} position={[0, -5, -4]} scale={[10, 3, 1]} />
    <Lightformer form="ring" intensity={2} position={[3, 3, -6]} scale={3} />
  </Environment>
);

const Scene = ({ fit, ...model }: PhoneModelProps & { fit: number }) => (
  <Canvas
    dpr={[1, 2]}
    gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
    camera={{ fov: FOV, position: [0, 0, HEIGHT / fit / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)))], near: 0.1, far: 50 }}
    style={{ pointerEvents: 'none' }}
  >
    <ambientLight intensity={0.25} />
    <directionalLight position={[3, 5, 6]} intensity={1.1} />
    <StudioLights />
    <PhoneModel {...model} />
  </Canvas>
);

/** Fills its (positioned) parent; `fit` is the share of the canvas height the phone occupies. */
export const PhoneScene = ({ fit = 0.72, ...model }: PhoneModelProps & { fit?: number }) => (
  <div className="absolute inset-0">
    <Scene fit={fit} {...model} />
  </div>
);

interface RealisticPhoneProps extends PhoneModelProps {
  className?: string;
}

// Renders inside a box the size of the phone; the canvas overflows it so rotations never clip.
const RealisticPhone = ({ className, ...model }: RealisticPhoneProps) => (
  <div className={`relative h-[calc(var(--phone-w)*2.1)] w-[var(--phone-w)] ${className ?? ''}`}>
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: `${CANVAS_SCALE.x * 100}%`, height: `${CANVAS_SCALE.y * 100}%` }}
    >
      <Scene fit={1 / CANVAS_SCALE.y} {...model} />
    </div>
  </div>
);

export default RealisticPhone;
