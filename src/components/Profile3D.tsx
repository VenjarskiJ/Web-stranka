import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Tento komponent renderuje samotný 3D hologram
function HologramPointCloud() {
  // Načítame fotku zo zložky public/profile.jpg
  const texture = useTexture('./profile.jpg');
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    // Vytvoríme mriežku s vysokým rozlíšením (vyše 20 000 bodov)
    const geo = new THREE.PlaneGeometry(3, 4, 150, 200); 
    
    // Vlastný Shader (Kúzlo, ktoré robí z 2D fotky 3D)
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 }
      },
      vertexShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vUv = uv;
          vec4 texColor = texture2D(uTexture, uv);
          
          // Zistíme jas pixelu (luminance) - svetlé pixely budú vpredu, tmavé vzadu
          float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
          vElevation = luminance;

          vec3 pos = position;
          // Displace: vytlačíme body do 3D priestoru na základe jasu
          pos.z += luminance * 0.8; 
          
          // Pridáme jemný kybernetický šum/vlnenie
          pos.z += sin(pos.x * 10.0 + uTime * 2.0) * 0.05;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          
          // Veľkosť bodiek
          gl_PointSize = 2.5; 
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vec4 color = texture2D(uTexture, vUv);
          
          // Ak je to úplná tma (pozadie), zahodíme to (urobíme priehľadné)
          if(vElevation < 0.1) discard;

          // Holografický farebný filter (pridáme tyrkysovú/zelenú žiaru)
          vec3 cyberColor = mix(color.rgb, vec3(0.0, 1.0, 0.8), 0.3);
          
          // Urobíme z bodiek guličky (nie štvorce)
          float dist = distance(gl_PointCoord, vec2(0.5));
          if(dist > 0.5) discard;

          // Scanline efekt bežiaci zhora nadol
          float scanline = sin(vUv.y * 50.0 - uTime * 5.0) * 0.5 + 0.5;
          cyberColor += vec3(0.0, 0.5, 0.5) * scanline * 0.3;

          gl_FragColor = vec4(cyberColor, color.a * (0.6 + vElevation * 0.4));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat };
  }, [texture]);

  // Animácia rotácie pri pohybe myšou
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
      // Natáčanie hologramu za myšou
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, (state.pointer.x * Math.PI) / 4, 0.1);
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, (-state.pointer.y * Math.PI) / 6, 0.1);
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}


// Hlavný wrapper
export default function Profile3D({ theme, lang }: { theme?: string, lang?: string }) {
  return (
    <div className="w-full max-w-[280px] mx-auto aspect-[3/4] relative cursor-crosshair group">
      {/* Kybernetická žiara na pozadí */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-green-500/20 blur-3xl group-hover:from-cyan-500/40 group-hover:to-green-500/40 transition-all duration-700"></div>
      
      {/* 3D Scéna */}
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} className="rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm">
        <React.Suspense fallback={null}>
          <HologramPointCloud />
        </React.Suspense>
      </Canvas>

      {/* Zameriavače ako predtým */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
        <div className="flex flex-col">
          <span className="text-cyan-400 font-mono text-[10px] tracking-[0.2em] font-bold animate-pulse">LIDAR_SCAN_ACTIVE</span>
          <span className="text-cyan-200/70 font-mono text-[8px] tracking-widest mt-1">POINT_CLOUD_DATA</span>
        </div>
        <div className="w-8 h-8 border-r-2 border-b-2 border-cyan-400/80"></div>
      </div>
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400/80 pointer-events-none"></div>
    </div>
  );
}