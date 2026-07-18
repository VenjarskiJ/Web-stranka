import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const cloudVertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    vec3 p = position;
    float wave = sin(p.x * 0.72 + uTime * 0.22 + aPhase * 5.0) * 0.18;
    p.y += wave + sin(p.z * 1.4 + uTime * 0.18) * 0.1;
    p.x += uMouse.x * (0.08 + abs(p.z) * 0.012);
    p.y += uMouse.y * (0.06 + abs(p.z) * 0.008) - uScroll * (0.08 + aPhase * 0.06);
    p.z += mod(uScroll * 0.18 + aPhase * 0.4, 3.0);

    vec4 modelPosition = modelMatrix * vec4(p, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aSize * (22.0 / max(1.0, -viewPosition.z));
    vColor = aColor;
    vDepth = clamp(1.0 - (-viewPosition.z / 22.0), 0.16, 1.0);
  }
`;

const cloudFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float core = smoothstep(0.5, 0.0, d);
    float halo = smoothstep(0.5, 0.14, d) * 0.35;
    gl_FragColor = vec4(vColor * (1.0 + core * 0.9), (core + halo) * vDepth * 0.62);
  }
`;

const gridVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gridFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;

  float gridLine(float value, float width) {
    float line = abs(fract(value - 0.5) - 0.5) / fwidth(value);
    return 1.0 - min(line / width, 1.0);
  }

  void main() {
    vec2 p = vUv - 0.5;
    vec2 mouseUv = uMouse * 0.5 + 0.5;
    float reveal = smoothstep(0.42, 0.02, distance(vUv, mouseUv));
    float gx = gridLine(vUv.x * 38.0, 1.0);
    float gy = gridLine(vUv.y * 24.0 + sin(vUv.x * 8.0 + uTime * 0.2) * 0.08, 1.0);
    float grid = max(gx, gy);
    float vignette = smoothstep(0.78, 0.18, length(p));
    vec3 color = mix(vec3(0.34, 0.15, 0.8), vec3(0.0, 0.82, 0.95), vUv.x);
    float alpha = grid * (0.018 + reveal * 0.105) * vignette;
    gl_FragColor = vec4(color, alpha);
  }
`;

function ReconstructionField() {
  const pointsMaterial = useRef<THREE.ShaderMaterial>(null);
  const gridMaterial = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const targetPointer = useRef(new THREE.Vector2(0, 0));
  const scrollTarget = useRef(0);
  const scrollValue = useRef(0);
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const isCompact = window.innerWidth < 768;
    const count = isCompact ? 520 : 1050;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const cyan = new THREE.Color('#2dd4ea');
    const violet = new THREE.Color('#7c3aed');
    const blue = new THREE.Color('#2563eb');

    for (let index = 0; index < count; index += 1) {
      const phase = Math.random();
      const band = Math.floor(Math.random() * 5);
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.2 + Math.random() * 7.8;
      const shapeNoise = (Math.random() - 0.5) * 1.8;
      const baseX = Math.cos(angle) * radius;
      const baseY = Math.sin(angle) * radius * 0.58;

      positions[index * 3] = baseX + Math.sin(baseY * 1.2) * 0.8 + shapeNoise;
      positions[index * 3 + 1] = baseY + Math.sin(angle * 3.0) * 0.6 + (band - 2) * 0.16;
      positions[index * 3 + 2] = -1.5 - Math.random() * 10 + Math.sin(baseX) * 0.7;

      const mixed = (band % 3 === 0 ? cyan : band % 3 === 1 ? violet : blue).clone();
      mixed.lerp(cyan, Math.random() * 0.3);
      colors[index * 3] = mixed.r;
      colors[index * 3 + 1] = mixed.g;
      colors[index * 3 + 2] = mixed.b;
      sizes[index] = 1.0 + Math.random() * 2.7;
      phases[index] = phase;
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    buffer.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    buffer.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    return buffer;
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      targetPointer.current.set(
        event.clientX / window.innerWidth * 2 - 1,
        -(event.clientY / window.innerHeight * 2 - 1),
      );
    };
    const handleScroll = () => {
      scrollTarget.current = window.scrollY / Math.max(window.innerHeight, 1);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useFrame((state, delta) => {
    pointer.current.lerp(targetPointer.current, Math.min(delta * 2.8, 1));
    scrollValue.current = THREE.MathUtils.lerp(scrollValue.current, scrollTarget.current, Math.min(delta * 2.4, 1));

    if (pointsMaterial.current) {
      pointsMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
      pointsMaterial.current.uniforms.uMouse.value.copy(pointer.current);
      pointsMaterial.current.uniforms.uScroll.value = scrollValue.current;
    }
    if (gridMaterial.current) {
      gridMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
      gridMaterial.current.uniforms.uMouse.value.copy(pointer.current);
    }
    if (group.current) {
      group.current.rotation.y = pointer.current.x * 0.045;
      group.current.rotation.x = -pointer.current.y * 0.035;
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={pointsMaterial}
          vertexShader={cloudVertex}
          fragmentShader={cloudFragment}
          uniforms={{
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uMouse: { value: new THREE.Vector2() },
          }}
          transparent
          depthWrite={false}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh position={[0, 0, -9]} scale={[Math.max(viewport.width, 18), Math.max(viewport.height, 11), 1]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial
          ref={gridMaterial}
          vertexShader={gridVertex}
          fragmentShader={gridFragment}
          uniforms={{ uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() } }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function SignalBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="signal-background" aria-hidden="true">
      <div className="signal-background__aurora" />
      <div className="signal-background__grid" />
      {!shouldReduceMotion && (
        <Canvas
          dpr={[0.65, 1.2]}
          camera={{ position: [0, 0, 7.5], fov: 46, near: 0.1, far: 60 }}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          frameloop="always"
        >
          <ReconstructionField />
        </Canvas>
      )}
      <div className="signal-background__noise" />
      <div className="signal-background__vignette" />
    </div>
  );
}
