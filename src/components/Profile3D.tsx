import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { type CSSProperties, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const PROFILE_IMAGE =
  'https://i1.rgstatic.net/ii/profile.image/11431281728263101-1763171443560_Q512/Jaroslav-Venjarski.jpg';

const scanVertex = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uVelocity;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    float wave = sin((uv.y * 34.0) + uTime * 2.1) * 0.012;
    transformed.z += wave + sin(uv.x * 18.0 + uTime) * 0.006;
    transformed.x += sin(uv.y * 92.0 + uTime * 8.0) * uVelocity * 0.022;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const scanFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uVelocity;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float edge = 1.0 - smoothstep(0.28, 0.49, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    float scan = 0.45 + 0.55 * sin(vUv.y * 720.0 - uTime * 14.0);
    float glitchBand = step(0.965 - uVelocity * 0.15, noise(vec2(floor(vUv.y * 40.0), floor(uTime * 14.0))));
    vec3 cyan = vec3(0.02, 0.94, 1.0);
    vec3 violet = vec3(0.62, 0.20, 1.0);
    vec3 magenta = vec3(1.0, 0.12, 0.58);
    vec3 color = mix(violet, cyan, vUv.y + sin(uTime) * 0.08);
    color = mix(color, magenta, glitchBand * (0.28 + uVelocity * 0.5));
    float alpha = (0.055 + scan * 0.15 + glitchBand * (0.12 + uVelocity * 0.34)) * edge;
    gl_FragColor = vec4(color, alpha);
  }
`;

const pointVertex = /* glsl */ `
  attribute float aPhase;
  uniform float uTime;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.8 + aPhase * 8.0) * 0.035;
    p.y += cos(uTime * 0.65 + aPhase * 7.0) * 0.03;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (2.2 + sin(uTime * 2.0 + aPhase * 15.0) * 1.2) * (7.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = 0.34 + 0.66 * sin(aPhase * 18.0 + uTime * 1.5) * 0.5 + 0.5;
  }
`;

const pointFragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.05, distanceToCenter) * vAlpha;
    vec3 violet = vec3(0.44, 0.16, 1.0);
    vec3 cyan = vec3(0.02, 0.96, 1.0);
    vec3 magenta = vec3(1.0, 0.18, 0.62);
    vec3 color = mix(violet, cyan, gl_PointCoord.y);
    color = mix(color, magenta, smoothstep(0.58, 1.0, gl_PointCoord.x) * 0.55);
    gl_FragColor = vec4(color, alpha);
  }
`;

function HologramScene({ velocity }: { velocity: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const scanMaterial = useRef<THREE.ShaderMaterial>(null);
  const pointMaterial = useRef<THREE.ShaderMaterial>(null);

  const particleGeometry = useMemo(() => {
    const count = 820;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      const side = index % 4;
      const scatter = Math.pow(Math.random(), 2) * 0.58;
      let x = 0;
      let y = 0;

      if (side < 2) {
        x = (Math.random() - 0.5) * 3.38;
        y = (side === 0 ? 1 : -1) * (2.12 + scatter);
      } else {
        x = (side === 2 ? 1 : -1) * (1.63 + scatter);
        y = (Math.random() - 0.5) * 4.35;
      }

      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 0.9;
      phases[index] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    return geometry;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const easedVelocity = THREE.MathUtils.lerp(
      scanMaterial.current?.uniforms.uVelocity.value ?? 0,
      velocity.current,
      Math.min(delta * 8, 1),
    );

    if (scanMaterial.current) {
      scanMaterial.current.uniforms.uTime.value = time;
      scanMaterial.current.uniforms.uVelocity.value = easedVelocity;
    }
    if (pointMaterial.current) pointMaterial.current.uniforms.uTime.value = time;
    if (group.current) {
      group.current.rotation.z = Math.sin(time * 0.34) * 0.008;
      group.current.position.y = Math.sin(time * 0.62) * 0.035;
    }
    velocity.current = THREE.MathUtils.lerp(velocity.current, 0, Math.min(delta * 3.5, 1));
  });

  return (
    <group ref={group}>
      <Float speed={1.35} rotationIntensity={0.06} floatIntensity={0.12}>
        <mesh position={[0, 0, 0.12]}>
          <planeGeometry args={[3.24, 4.3, 40, 48]} />
          <shaderMaterial
            ref={scanMaterial}
            vertexShader={scanVertex}
            fragmentShader={scanFragment}
            uniforms={{ uTime: { value: 0 }, uVelocity: { value: 0 } }}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <points geometry={particleGeometry}>
          <shaderMaterial
            ref={pointMaterial}
            vertexShader={pointVertex}
            fragmentShader={pointFragment}
            uniforms={{ uTime: { value: 0 } }}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <mesh position={[0, -2.31, -0.18]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[2.34, 2.34, 0.015]} />
          <meshBasicMaterial color="#4de9ff" wireframe transparent opacity={0.1} />
        </mesh>

        {[-0.82, 0, 0.82].map((x, index) => (
          <mesh key={x} position={[x, -2.58, -0.4]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.42 + index * 0.04, 2.6, 32, 1, true]} />
            <meshBasicMaterial
              color={index === 1 ? '#a855f7' : '#22d3ee'}
              transparent
              opacity={0.025}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </Float>
    </group>
  );
}

export default function Profile3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const lastPointer = useRef({ x: 0, y: 0, at: performance.now() });
  const velocity = useRef(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glitch = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 130, damping: 18, mass: 0.55 });
  const springY = useSpring(y, { stiffness: 130, damping: 18, mass: 0.55 });
  const rotateX = useTransform(springY, [-1, 1], ['8deg', '-8deg']);
  const rotateY = useTransform(springX, [-1, 1], ['-10deg', '10deg']);
  const translateXRed = useTransform(glitch, [0, 1], [1.5, 11]);
  const translateXBlue = useTransform(glitch, [0, 1], [-1.5, -11]);
  const glitchOpacity = useTransform(glitch, [0, 0.15, 1], [0.055, 0.17, 0.48]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;

      const normalizedX = THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
      const normalizedY = THREE.MathUtils.clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
      x.set(normalizedX);
      y.set(normalizedY);

      const now = performance.now();
      const elapsed = Math.max(now - lastPointer.current.at, 16);
      const distance = Math.hypot(event.clientX - lastPointer.current.x, event.clientY - lastPointer.current.y);
      const speed = THREE.MathUtils.clamp(distance / elapsed / 1.4, 0, 1);
      velocity.current = Math.max(velocity.current, speed);
      glitch.set(speed);
      lastPointer.current = { x: event.clientX, y: event.clientY, at: now };
    };

    const reset = () => {
      x.set(0);
      y.set(0);
      glitch.set(0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', reset);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', reset);
    };
  }, [glitch, x, y]);

  return (
    <div ref={cardRef} className="profile-hologram" aria-label="Interactive holographic portrait of Jaroslav Venjarski">
      <motion.div
        className="profile-hologram__stage"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <div className="profile-hologram__halo" />
        <div
          className="profile-hologram__frame"
          style={{ '--holo-photo': `url(${PROFILE_IMAGE})` } as CSSProperties}
        >
          <div className="profile-hologram__fallback" aria-hidden="true">JV</div>
          <img
            src={PROFILE_IMAGE}
            alt="Jaroslav Venjarski"
            referrerPolicy="no-referrer"
            className="profile-hologram__image"
            onError={(event) => { event.currentTarget.style.display = 'none'; }}
          />
          <motion.img
            aria-hidden="true"
            src={PROFILE_IMAGE}
            referrerPolicy="no-referrer"
            className="profile-hologram__image profile-hologram__image--red"
            style={{ x: translateXRed, opacity: glitchOpacity }}
            onError={(event) => { event.currentTarget.style.display = 'none'; }}
          />
          <motion.img
            aria-hidden="true"
            src={PROFILE_IMAGE}
            referrerPolicy="no-referrer"
            className="profile-hologram__image profile-hologram__image--blue"
            style={{ x: translateXBlue, opacity: glitchOpacity }}
            onError={(event) => { event.currentTarget.style.display = 'none'; }}
          />
          <div className="profile-hologram__slices" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((slice) => (
              <span key={slice} />
            ))}
          </div>
          <div className="profile-hologram__grade" />
          <div className="profile-hologram__dissolve" />
          <div className="profile-hologram__sweep" />
        </div>

        <div className="profile-hologram__canvas" aria-hidden="true">
          <Canvas
            dpr={[0.75, 1.35]}
            camera={{ position: [0, 0, 7.1], fov: 40 }}
            gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          >
            <HologramScene velocity={velocity} />
          </Canvas>
        </div>

        <div className="profile-hologram__hud profile-hologram__hud--top">
          <span>SPATIAL ID / JV-03</span>
          <span className="status-dot">LIVE</span>
        </div>
        <div className="profile-hologram__hud profile-hologram__hud--bottom">
          <span>SPATIAL SIGNAL</span>
          <span>CALIBRATED</span>
        </div>
        <div className="profile-hologram__projector" aria-hidden="true">
          <span /><span /><span />
        </div>
      </motion.div>
    </div>
  );
}
