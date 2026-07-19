import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function Profile3D({ theme, lang }: { theme?: string, lang?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Glitch offsets based on mouse speed/position
  const glitchX1 = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);
  const glitchX2 = useTransform(mouseXSpring, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const xPct = (e.clientX - centerX) / window.innerWidth;
      const yPct = (e.clientY - centerY) / window.innerHeight;

      x.set(xPct * 2.5);
      y.set(yPct * 2.5);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [x, y]);

  // Tvoja fotka
  const photoUrl = "https://i1.rgstatic.net/ii/profile.image/11431281728263101-1763171443560_Q512/Jaroslav-Venjarski.jpg";

  return (
    <div className="perspective-1000 w-full max-w-[280px] mx-auto relative" ref={cardRef}>
      {/* CSS Animácie pre scanline a hologramové blikanie */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scanline {
          animation: scanline 3s linear infinite;
        }
        @keyframes hologramFlicker {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
          70% { opacity: 0.8; }
        }
        .animate-flicker {
          animation: hologramFlicker 4s infinite alternate;
        }
      `}</style>

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full aspect-[3/4] rounded-2xl cursor-pointer group"
      >
        {/* Background glowing aura */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500/50 to-cyan-500/50 blur-2xl group-hover:blur-3xl transition-all duration-500 animate-flicker" style={{ transform: "translateZ(-50px)" }}></div>
        
        {/* Hlavná karta */}
        <div className="absolute inset-0 rounded-2xl border border-cyan-500/30 dark:border-cyan-400/50 overflow-hidden bg-black/80 backdrop-blur-sm group-hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-500" style={{ transform: "translateZ(0px)" }}>
          
          {/* Základná fotka */}
          <img 
            src={photoUrl} 
            referrerPolicy="no-referrer"
            alt="Jaroslav Venjarski" 
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out saturate-50 group-hover:saturate-100 group-hover:scale-105" 
          />

          {/* RGB Split / Glitch vrstva 1 (Cyan) */}
          <motion.img 
            src={photoUrl} 
            style={{ x: glitchX1, transformStyle: "preserve-3d" }}
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-0 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none filter hue-rotate-[180deg] brightness-125" 
          />
          
          {/* RGB Split / Glitch vrstva 2 (Pink/Red) */}
          <motion.img 
            src={photoUrl} 
            style={{ x: glitchX2, transformStyle: "preserve-3d" }}
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-0 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none filter hue-rotate-[300deg] saturate-200" 
          />

          {/* Kybernetická Mriežka (Matrix Grid) */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>

          {/* Pohybujúci sa Skener (Scanline) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-full h-1/3 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent animate-scanline"></div>
          </div>

          {/* Tmavý prechod na spodku, aby bol vidieť text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none"></div>

          {/* Futurictické grafické zameriavače (Zobrazia sa po prejdení myšou) */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex flex-col">
              <span className="text-cyan-400 font-mono text-[10px] tracking-widest animate-pulse">TARGET_LOCKED</span>
              <span className="text-white/60 font-mono text-[8px] tracking-widest">NVS // 3D RECONSTRUCTION</span>
            </div>
            <div className="w-6 h-6 border-r-2 border-b-2 border-cyan-400"></div>
          </div>
          <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </motion.div>
    </div>
  );
}