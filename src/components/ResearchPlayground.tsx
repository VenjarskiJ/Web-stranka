import { Canvas, useFrame } from '@react-three/fiber';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Camera, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type Language = 'en' | 'sk';
type Theme = 'dark' | 'light';

const translations = {
  en: {
    mission: 'MISSION / CALIBRATE THE ARRAY',
    title: 'Build a virtual camera rig.',
    description: 'Spread three viewpoints across the scene. Better angular coverage reveals more of the latent 3D reconstruction.',
    coverage: 'FIELD COVERAGE',
    camera: 'Camera',
    randomize: 'New challenge',
    assist: 'Auto-calibrate',
    contact: 'Apply this thinking to your project',
    statuses: ['DEGENERATE BASELINE', 'PARALLAX IMPROVING', 'NEAR STABLE', 'VIRTUAL VIEW LOCKED'],
    solved: 'Calibration complete. The hidden viewpoint is stable.',
  },
  sk: {
    mission: 'MISIA / KALIBRÁCIA POĽA',
    title: 'Zostavte virtuálnu kamerovú sústavu.',
    description: 'Rozmiestnite tri pohľady okolo scény. Lepšie uhlové pokrytie odhalí väčšiu časť latentnej 3D rekonštrukcie.',
    coverage: 'POKRYTIE POĽA',
    camera: 'Kamera',
    randomize: 'Nová výzva',
    assist: 'Automatická kalibrácia',
    contact: 'Použiť tento prístup vo vašom projekte',
    statuses: ['DEGENEROVANÁ BÁZA', 'PARALAXA SA ZLEPŠUJE', 'TAKMER STABILNÉ', 'VIRTUÁLNY POHĽAD UZAMKNUTÝ'],
    solved: 'Kalibrácia dokončená. Skrytý pohľad je stabilný.',
  },
} as const;

function LatentBust({ quality, theme, reducedMotion }: { quality: number; theme: Theme; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const count = 5600;
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const random = (index: number, offset: number) => {
      const value = Math.sin(index * 91.73 + offset * 47.11) * 43758.5453;
      return value - Math.floor(value);
    };

    for (let index = 0; index < count; index += 1) {
      if (index < 3500) {
        const yUnit = random(index, 1) * 2 - 1;
        const angle = random(index, 2) * Math.PI * 2;
        const radius = Math.sqrt(Math.max(0, 1 - yUnit * yUnit));
        positions[index * 3] = Math.cos(angle) * radius * 0.72;
        positions[index * 3 + 1] = yUnit * 0.94 + 0.37;
        positions[index * 3 + 2] = Math.sin(angle) * radius * 0.61 + Math.exp(-Math.pow(yUnit + 0.02, 2) * 12) * 0.06;
      } else {
        const t = random(index, 3);
        const angle = random(index, 4) * Math.PI * 2;
        const width = 0.36 + t * 0.92;
        positions[index * 3] = Math.cos(angle) * width;
        positions[index * 3 + 1] = -0.55 - t * 0.76;
        positions[index * 3 + 2] = Math.sin(angle) * (0.33 + t * 0.2);
      }
    }

    const nextGeometry = new THREE.BufferGeometry();
    nextGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return nextGeometry;
  }, []);

  useEffect(() => {
    geometry.setDrawRange(0, Math.floor(count * (0.18 + quality * 0.82)));
  }, [geometry, quality]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y += delta * (0.12 + quality * 0.18);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.025;
  });

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <pointsMaterial
          color={quality > 0.9 ? '#67ffbf' : theme === 'dark' ? '#58e8ff' : '#167a91'}
          size={0.024}
          sizeAttenuation
          transparent
          opacity={0.72 + quality * 0.24}
          depthWrite={false}
          blending={theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>
      <mesh scale={[0.79, 1.02, 0.68]} position={[0, 0.36, 0]}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial
          color={quality > 0.9 ? '#67ffbf' : '#7758ff'}
          wireframe
          transparent
          opacity={0.025 + quality * 0.07}
        />
      </mesh>
    </group>
  );
}

function CameraRig({ angle, index, quality, theme }: { angle: number; index: number; quality: number; theme: Theme }) {
  const group = useRef<THREE.Group>(null);
  const radians = THREE.MathUtils.degToRad(angle);
  const position = useMemo<[number, number, number]>(() => [Math.sin(radians) * 3.15, 0.24, Math.cos(radians) * 3.15], [radians]);
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([...position, 0, 0.15, 0]), 3));
    return geometry;
  }, [position]);

  useEffect(() => () => lineGeometry.dispose(), [lineGeometry]);

  useFrame(() => group.current?.lookAt(0, 0.18, 0));

  const colors = ['#53ecff', '#a968ff', '#ff62b2'];
  return (
    <>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={colors[index]} transparent opacity={0.12 + quality * 0.18} />
      </lineSegments>
      <group ref={group} position={position} scale={0.66}>
        <mesh>
          <boxGeometry args={[0.34, 0.22, 0.24]} />
          <meshBasicMaterial color={theme === 'dark' ? colors[index] : '#235e70'} wireframe transparent opacity={0.72} />
        </mesh>
        <mesh position={[0, 0.16, -0.01]}>
          <boxGeometry args={[0.13, 0.08, 0.11]} />
          <meshBasicMaterial color={colors[index]} wireframe transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <torusGeometry args={[0.082, 0.017, 7, 22]} />
          <meshBasicMaterial color={colors[index]} transparent opacity={0.92} />
        </mesh>
        <mesh position={[0, 0, 0.155]}>
          <circleGeometry args={[0.05, 20]} />
          <meshBasicMaterial color={colors[index]} transparent opacity={0.42} />
        </mesh>
      </group>
    </>
  );
}

function CalibrationScene({ angles, quality, theme, reducedMotion }: { angles: number[]; quality: number; theme: Theme; reducedMotion: boolean }) {
  const orbit = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (orbit.current && !reducedMotion) orbit.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.16) * 0.08;
  });

  return (
    <>
      <ambientLight intensity={theme === 'dark' ? 0.65 : 1.4} />
      <directionalLight position={[2, 4, 3]} intensity={1.8} color="#adf5ff" />
      <group ref={orbit}>
        <LatentBust quality={quality} theme={theme} reducedMotion={reducedMotion} />
        {angles.map((angle, index) => <CameraRig key={index} angle={angle} index={index} quality={quality} theme={theme} />)}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.36, 0]}>
          <torusGeometry args={[2.85, 0.008, 4, 180]} />
          <meshBasicMaterial color="#51eaff" transparent opacity={0.2} />
        </mesh>
      </group>
    </>
  );
}

export default function ResearchPlayground({ lang, theme, onContact }: { lang: Language; theme: Theme; onContact: () => void }) {
  const t = translations[lang];
  const reducedMotion = Boolean(useReducedMotion());
  const [angles, setAngles] = useState([-18, 7, 24]);
  const sortedAngles = useMemo(() => [...angles].sort((a, b) => a - b), [angles]);
  const score = useMemo(() => {
    const ideal = [-62, 0, 62];
    const error = sortedAngles.reduce((total, angle, index) => total + Math.abs(angle - ideal[index]), 0);
    return Math.max(8, Math.min(100, Math.round(100 - error * 0.88)));
  }, [sortedAngles]);
  const quality = score / 100;
  const statusIndex = score >= 92 ? 3 : score >= 72 ? 2 : score >= 44 ? 1 : 0;
  const solved = score >= 92;

  const setAngle = (index: number, value: number) => {
    setAngles((current) => current.map((angle, cameraIndex) => cameraIndex === index ? value : angle));
  };

  const randomize = () => {
    const seed = Date.now() % 29;
    setAngles([-28 + seed % 17, -8 + seed % 13, 18 + seed % 19]);
  };

  return (
    <div className={`research-playground research-playground--${theme} cyber-panel`}>
      <div className="research-playground__visual">
        <div className="research-playground__hud"><span>NEURAL FIELD / LIVE</span><span>{String(score).padStart(3, '0')}% RESOLVED</span></div>
        <Canvas dpr={[0.72, 1.35]} camera={{ position: [4.6, 2.15, 7.6], fov: 42 }} gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}>
          <CalibrationScene angles={angles} quality={quality} theme={theme} reducedMotion={reducedMotion} />
        </Canvas>
        <div className="research-playground__reticle" aria-hidden="true"><i /><i /></div>
      </div>

      <div className="research-playground__console">
        <p className="research-playground__mission"><Sparkles size={15} />{t.mission}</p>
        <h3>{t.title}</h3>
        <p className="research-playground__description">{t.description}</p>

        <div className="coverage-readout">
          <div><span>{t.coverage}</span><strong>{score}%</strong></div>
          <i><b style={{ width: `${score}%` }} /></i>
          <p className={`coverage-status status-${statusIndex}`} aria-live="polite">{t.statuses[statusIndex]}</p>
        </div>

        <div className="camera-controls">
          {angles.map((angle, index) => (
            <label key={index}>
              <span><Camera size={14} />{t.camera} {String.fromCharCode(65 + index)}<strong>{angle > 0 ? '+' : ''}{angle}°</strong></span>
              <input
                type="range"
                min="-70"
                max="70"
                step="1"
                value={angle}
                onChange={(event) => setAngle(index, Number(event.target.value))}
                aria-label={`${t.camera} ${String.fromCharCode(65 + index)}`}
              />
            </label>
          ))}
        </div>

        <div className="research-playground__actions">
          <button type="button" onClick={randomize}><RefreshCw size={15} />{t.randomize}</button>
          <button type="button" onClick={() => setAngles([-62, 0, 62])}><Sparkles size={15} />{t.assist}</button>
        </div>

        <AnimatePresence mode="wait">
          {solved ? (
            <motion.div className="calibration-complete" key="solved" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p><CheckCircle2 size={17} />{t.solved}</p>
              <button type="button" onClick={onContact}>{t.contact}<ArrowUpRight size={16} /></button>
            </motion.div>
          ) : (
            <motion.p className="calibration-hint" key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>−62° · 0° · +62°</motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
