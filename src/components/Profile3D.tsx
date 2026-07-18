import { Canvas, useFrame } from '@react-three/fiber';
import {
  type KeyboardEvent,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';

const AVATAR_HULL_URL = './avatar/avatar-hull.bin?v=7';
const AVATAR_FACE_URL = './avatar/avatar-face.bin?v=7';
const MAX_YAW = Math.PI * 0.46;

type AvatarGeometryState = {
  geometry: THREE.BufferGeometry | null;
  failed: boolean;
};

function useAvatarGeometry(url: string): AvatarGeometryState {
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Avatar request failed: ${response.status}`);
        return response.arrayBuffer();
      })
      .then(setBuffer)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setFailed(true);
      });

    return () => controller.abort();
  }, [url]);

  const geometry = useMemo(() => {
    if (!buffer) return null;

    const view = new DataView(buffer);
    const count = view.getUint32(0, true);
    const positionBytes = count * 3 * Float32Array.BYTES_PER_ELEMENT;
    const colorOffset = 4 + positionBytes;
    if (colorOffset + count * 3 > buffer.byteLength) return null;

    const positions = new Float32Array(buffer.slice(4, colorOffset));
    const colors = new Uint8Array(buffer.slice(colorOffset, colorOffset + count * 3));
    const nextGeometry = new THREE.BufferGeometry();
    nextGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nextGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3, true));
    nextGeometry.computeBoundingSphere();
    return nextGeometry;
  }, [buffer]);

  useEffect(() => () => geometry?.dispose(), [geometry]);

  return { geometry, failed };
}

type AvatarSceneProps = {
  theme: 'dark' | 'light';
  targetYaw: MutableRefObject<number>;
  targetPitch: MutableRefObject<number>;
  velocity: MutableRefObject<number>;
  interacting: MutableRefObject<boolean>;
  reducedMotion: boolean;
};

function AvatarScene({ theme, targetYaw, targetPitch, velocity, interacting, reducedMotion }: AvatarSceneProps) {
  const { geometry } = useAvatarGeometry(AVATAR_HULL_URL);
  const { geometry: faceGeometry } = useAvatarGeometry(AVATAR_FACE_URL);
  const avatar = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (avatar.current) {
      const idle = !interacting.current && !reducedMotion ? Math.sin(time * 0.34) * 0.075 : 0;
      avatar.current.rotation.y = THREE.MathUtils.lerp(
        avatar.current.rotation.y,
        targetYaw.current + idle,
        Math.min(delta * 6.5, 1),
      );
      avatar.current.rotation.x = THREE.MathUtils.lerp(
        avatar.current.rotation.x,
        targetPitch.current,
        Math.min(delta * 6.5, 1),
      );
      avatar.current.position.x = reducedMotion ? 0 : Math.sin(time * 46.0) * velocity.current * 0.018;
      avatar.current.position.y = -0.02 + (reducedMotion ? 0 : Math.sin(time * 0.62) * 0.018);
    }

    if (orbit.current && !reducedMotion) {
      orbit.current.rotation.y = time * 0.08;
      orbit.current.rotation.z = Math.sin(time * 0.23) * 0.08;
    }

    velocity.current = THREE.MathUtils.lerp(velocity.current, 0, Math.min(delta * 3.4, 1));
  });

  return (
    <>
      <group ref={avatar} scale={1.06}>
        {geometry ? (
          <>
            <points geometry={geometry} frustumCulled={false}>
              <pointsMaterial
                color={theme === 'dark' ? '#5befff' : '#246f82'}
                size={theme === 'dark' ? 0.006 : 0.007}
                sizeAttenuation
                transparent
                opacity={theme === 'dark' ? 0.54 : 0.48}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </points>
            <points geometry={geometry} frustumCulled={false}>
              <pointsMaterial
                color={theme === 'dark' ? '#41edff' : '#2a99b4'}
                size={theme === 'dark' ? 0.005 : 0.006}
                sizeAttenuation
                transparent
                opacity={theme === 'dark' ? 0.18 : 0.14}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </points>
            {faceGeometry ? (
              <points geometry={faceGeometry} frustumCulled={false} renderOrder={4}>
                <pointsMaterial
                  color={theme === 'dark' ? '#b1847b' : '#58717a'}
                  size={theme === 'dark' ? 0.009 : 0.01}
                  sizeAttenuation
                  vertexColors
                  transparent
                  opacity={theme === 'dark' ? 0.98 : 1}
                  depthWrite
                  blending={THREE.NormalBlending}
                />
              </points>
            ) : null}
          </>
        ) : null}
      </group>

      <group ref={orbit} position={[0, 0.08, -0.35]}>
        <mesh rotation={[Math.PI / 2.34, 0.2, 0.32]}>
          <torusGeometry args={[1.58, 0.006, 4, 160]} />
          <meshBasicMaterial color="#38e8ff" transparent opacity={theme === 'dark' ? 0.28 : 0.12} />
        </mesh>
        <mesh rotation={[Math.PI / 2.08, 0.84, -0.46]}>
          <torusGeometry args={[1.78, 0.004, 4, 160]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={theme === 'dark' ? 0.18 : 0.08} />
        </mesh>
      </group>

      <mesh position={[0, -1.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.62, 1.38, 96]} />
        <meshBasicMaterial
          color={theme === 'dark' ? '#37e9ff' : '#198ba5'}
          transparent
          opacity={theme === 'dark' ? 0.13 : 0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

type Profile3DProps = {
  theme: 'dark' | 'light';
};

export default function Profile3D({ theme }: Profile3DProps) {
  const root = useRef<HTMLDivElement>(null);
  const targetYaw = useRef(0);
  const targetPitch = useRef(0);
  const velocity = useRef(0);
  const interacting = useRef(false);
  const drag = useRef({ active: false, startX: 0, startYaw: 0 });
  const pointer = useRef({ x: 0, y: 0, at: performance.now() });
  const [angle, setAngle] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const setYaw = (next: number) => {
    const clamped = THREE.MathUtils.clamp(next, -MAX_YAW, MAX_YAW);
    targetYaw.current = clamped;
    setAngle(Math.round(THREE.MathUtils.radToDeg(clamped)));
  };

  const updateVelocity = (event: ReactPointerEvent<HTMLDivElement>) => {
    const now = performance.now();
    const elapsed = Math.max(now - pointer.current.at, 16);
    const distance = Math.hypot(event.clientX - pointer.current.x, event.clientY - pointer.current.y);
    velocity.current = Math.max(velocity.current, THREE.MathUtils.clamp(distance / elapsed / 1.5, 0, 1));
    pointer.current = { x: event.clientX, y: event.clientY, at: now };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = root.current?.getBoundingClientRect();
    if (!bounds) return;
    updateVelocity(event);

    if (drag.current.active) {
      const delta = (event.clientX - drag.current.startX) / bounds.width;
      setYaw(drag.current.startYaw + delta * Math.PI * 1.55);
    } else {
      const normalizedX = THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1);
      setYaw(normalizedX * 0.72);
    }

    const normalizedY = THREE.MathUtils.clamp(((event.clientY - bounds.top) / bounds.height) * 2 - 1, -1, 1);
    targetPitch.current = normalizedY * 0.055;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { active: true, startX: event.clientX, startYaw: targetYaw.current };
    interacting.current = true;
    setIsInteracting(true);
    handlePointerMove(event);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current.active = false;
    interacting.current = false;
    setIsInteracting(false);
  };

  const handlePointerLeave = () => {
    if (drag.current.active) return;
    interacting.current = false;
    setIsInteracting(false);
    targetPitch.current = 0;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') setYaw(0);
    else setYaw(targetYaw.current + (event.key === 'ArrowRight' ? 0.16 : -0.16));
  };

  return (
    <div
      ref={root}
      className={`profile-hologram profile-hologram--${theme}${isInteracting ? ' is-interacting' : ''}`}
      role="group"
      tabIndex={0}
      aria-label="Interactive three-dimensional point-cloud avatar of Jaroslav Venjarski. Move or drag to rotate; use arrow keys for precise rotation."
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
    >
      <div className="profile-hologram__stage">
        <div className="profile-hologram__aura" aria-hidden="true" />
        <div className="profile-hologram__grid" aria-hidden="true" />
        <div className="profile-hologram__canvas" aria-hidden="true">
          <Canvas
            dpr={[0.8, 1.45]}
            camera={{ position: [0, 0.04, 5.75], fov: 38 }}
            gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          >
            <AvatarScene
              theme={theme}
              targetYaw={targetYaw}
              targetPitch={targetPitch}
              velocity={velocity}
              interacting={interacting}
              reducedMotion={reducedMotion}
            />
          </Canvas>
        </div>

        <div className="profile-hologram__scan" aria-hidden="true" />
        <div className="profile-hologram__hud profile-hologram__hud--top">
          <span>VOLUMETRIC SELF / 53K XYZ</span>
          <span className="status-dot">LIVE POINT CLOUD</span>
        </div>
        <div className="profile-hologram__hud profile-hologram__hud--bottom">
          <span>YAW {angle > 0 ? '+' : ''}{angle}°</span>
          <span>{theme === 'dark' ? 'SPECTRAL MODE' : 'NATURAL SPLATS'}</span>
        </div>
        <div className="profile-hologram__projector" aria-hidden="true"><span /><span /><span /></div>
      </div>

      <div className="profile-hologram__rotate-hint" aria-hidden="true">
        <span>ROTATE</span>
        <i><b style={{ left: `${50 + (angle / 83) * 44}%` }} /></i>
        <span>MOVE / DRAG</span>
      </div>
    </div>
  );
}
