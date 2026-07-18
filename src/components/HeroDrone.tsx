import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type RotorProps = {
  position: [number, number, number];
  clockwise: boolean;
  accent: string;
};

function Rotor({ position, clockwise, accent }: RotorProps) {
  const blades = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (blades.current) {
      blades.current.rotation.y = state.clock.elapsedTime * (clockwise ? 34 : -34);
    }
  });

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.13, 0.16, 0.13, 24]} />
        <meshStandardMaterial color="#111c25" metalness={0.92} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.075, 0]}>
        <cylinderGeometry args={[0.055, 0.07, 0.08, 20]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.8} metalness={0.75} roughness={0.2} />
      </mesh>
      <group ref={blades} position={[0, 0.145, 0]}>
        <mesh>
          <boxGeometry args={[0.82, 0.014, 0.065]} />
          <meshBasicMaterial color="#b9f7ff" transparent opacity={0.38} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.82, 0.014, 0.065]} />
          <meshBasicMaterial color="#d6c7ff" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.355, 48]} />
          <meshBasicMaterial color={accent} transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

function DroneModel() {
  const rotors: RotorProps[] = [
    { position: [0.86, 0.02, 0.7], clockwise: true, accent: '#4de9ff' },
    { position: [0.86, 0.02, -0.7], clockwise: false, accent: '#a985ff' },
    { position: [-0.76, 0.02, 0.7], clockwise: false, accent: '#ff59ad' },
    { position: [-0.76, 0.02, -0.7], clockwise: true, accent: '#4de9ff' },
  ];

  return (
    <group rotation={[0.04, 0, -0.02]}>
      {rotors.map((rotor) => {
        const armLength = Math.hypot(rotor.position[0], rotor.position[2]);
        const angle = Math.atan2(rotor.position[2], rotor.position[0]);
        return (
          <group key={`${rotor.position[0]}-${rotor.position[2]}`}>
            <mesh position={[rotor.position[0] * 0.48, 0.01, rotor.position[2] * 0.48]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[armLength * 0.84, 0.065, 0.075]} />
              <meshStandardMaterial color="#1a2a35" metalness={0.88} roughness={0.28} />
            </mesh>
            <Rotor {...rotor} />
          </group>
        );
      })}

      <mesh scale={[1.04, 0.34, 0.62]}>
        <sphereGeometry args={[0.75, 48, 28]} />
        <meshPhysicalMaterial color="#142833" metalness={0.82} roughness={0.22} clearcoat={1} clearcoatRoughness={0.18} />
      </mesh>
      <mesh position={[0.08, 0.24, 0]} scale={[0.58, 0.22, 0.43]}>
        <sphereGeometry args={[0.72, 40, 24]} />
        <meshPhysicalMaterial color="#65e9ff" emissive="#147f9a" emissiveIntensity={0.45} transparent opacity={0.52} transmission={0.2} metalness={0.3} roughness={0.12} />
      </mesh>

      <mesh position={[0.8, -0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.24, 0.24, 32]} />
        <meshStandardMaterial color="#081016" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0.925, -0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.135, 32]} />
        <meshBasicMaterial color="#9af7ff" transparent opacity={0.92} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0.938, -0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.145, 0.17, 32]} />
        <meshBasicMaterial color="#ff59ad" transparent opacity={0.78} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh position={[-0.68, -0.03, 0.37]}>
        <sphereGeometry args={[0.045, 18, 12]} />
        <meshBasicMaterial color="#ff59ad" blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[-0.68, -0.03, -0.37]}>
        <sphereGeometry args={[0.045, 18, 12]} />
        <meshBasicMaterial color="#4de9ff" blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh position={[0.05, -0.92, 0]}>
        <coneGeometry args={[0.72, 1.85, 48, 1, true]} />
        <meshBasicMaterial color="#4de9ff" transparent opacity={0.035} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0.05, -1.84, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.34, 0.36, 48]} />
        <meshBasicMaterial color="#4de9ff" transparent opacity={0.26} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight position={[0.85, 0, 0]} color="#76efff" intensity={2.4} distance={3.8} />
    </group>
  );
}

function DroneFlight() {
  const flight = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const trailColor = useMemo(() => new THREE.Color('#4de9ff'), []);

  useFrame((state) => {
    if (!flight.current) return;
    const cycle = (state.clock.elapsedTime % 18) / 18;
    const arc = Math.sin(cycle * Math.PI);
    const start = -viewport.width / 2 - 3.2;
    const end = viewport.width / 2 + 3.2;

    flight.current.position.set(
      THREE.MathUtils.lerp(start, end, cycle),
      1.95 + arc * 0.55 + Math.sin(cycle * Math.PI * 5) * 0.05,
      -0.75 + arc * 0.8,
    );
    flight.current.rotation.set(
      Math.sin(cycle * Math.PI * 2) * 0.04,
      -0.16 + Math.sin(cycle * Math.PI) * 0.18,
      -Math.cos(cycle * Math.PI) * 0.15,
    );
    const scale = 0.2 + arc * 0.065;
    flight.current.scale.setScalar(scale);
  });

  return (
    <Trail width={0.24} length={3.8} color={trailColor} attenuation={(width) => width * width}>
      <group ref={flight}>
        <DroneModel />
      </group>
    </Trail>
  );
}

export default function HeroDrone() {
  const shouldReduceMotion = useReducedMotion();
  const [isCompact, setIsCompact] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 820px)');
    const update = () => setIsCompact(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  if (shouldReduceMotion || isCompact) return null;

  return (
    <div className="hero-drone" aria-hidden="true">
      <Canvas
        dpr={[0.7, 1.2]}
        camera={{ position: [0, 0, 10], fov: 40, near: 0.1, far: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.78} />
        <directionalLight position={[4, 6, 7]} color="#b8f6ff" intensity={2.1} />
        <directionalLight position={[-4, 2, 3]} color="#a985ff" intensity={1.35} />
        <DroneFlight />
      </Canvas>
      <div className="hero-drone__readout"><i />AUTONOMOUS VISION PROBE</div>
    </div>
  );
}
