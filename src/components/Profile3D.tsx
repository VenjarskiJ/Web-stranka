import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

// --- Komponent pre padajúci Matrix kód ---
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Nastavenie veľkosti plátna podľa rodiča
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const letters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      // Jemne priehľadné čierne pozadie pre efekt "chvostov" padajúceho kódu
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Farba Matrixu
      ctx.fillStyle = '#0f0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen opacity-50" />;
};


// --- Hlavný komponent profilu ---
export default function Profile3D({ theme, lang }: { theme?: string, lang?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Fyzika pre 3D nakláňanie
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Glitch rozbitie obrazu reagujúce na pohyb myši
  const glitchX1 = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);
  const glitchX2 = useTransform(mouseXSpring, [-0.5, 0.5], [12, -12]);

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
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        .animate-scanline {
          animation: scanline 2.5s linear infinite;
        }
        @keyframes hologramFlicker {
          0%, 100% { opacity: 0.8; }
          5% { opacity: 0.3; }
          10% { opacity: 0.9; }
          15% { opacity: 0.2; }
          20% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .group-hover\\:animate-hologram:hover {
          animation: hologramFlicker 3s infinite;
        }
      `}</style>

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full aspect-[3/4] rounded-2xl cursor-pointer group group-hover:animate-hologram"
      >
        {/* Svietiaca Aura za kartou (zeleno-tyrkysová pre Matrix) */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-green-500/30 to-cyan-500/30 blur-2xl group-hover:from-green-500/60 group-hover:to-cyan-500/60 transition-all duration-500" style={{ transform: "translateZ(-50px)" }}></div>
        
        {/* Hlavná Karta */}
        <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-green-400/50 overflow-hidden bg-black/80 transition-all duration-500 group-hover:shadow-[0_0_50px_rgba(34,197,94,0.4)]" style={{ transform: "translateZ(0px)" }}>
          
          {/* 1. Základná fotka (V normálnom stave klasická, po najdení sa zmení na hologram) */}
          <img 
            src={photoUrl} 
            referrerPolicy="no-referrer"
            alt="Jaroslav Venjarski" 
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out grayscale-[20%] group-hover:grayscale group-hover:brightness-50 group-hover:contrast-150" 
          />

          {/* 2. Zelený holografický prepis (Color Dodge pre svietivý efekt) */}
          <div className="absolute inset-0 bg-green-500/40 mix-blend-color-dodge opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

          {/* 3. Glitch efekt - Vrstva 1 (Tyrkysová) */}
          <motion.img 
            src={photoUrl} 
            style={{ x: glitchX1, transformStyle: "preserve-3d" }}
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-0 group-hover:opacity-70 transition-opacity duration-150 pointer-events-none filter hue-rotate-[180deg] saturate-200" 
          />
          
          {/* 4. Glitch efekt - Vrstva 2 (Zelená) */}
          <motion.img 
            src={photoUrl} 
            style={{ x: glitchX2, transformStyle: "preserve-3d" }}
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-0 group-hover:opacity-60 transition-opacity duration-150 pointer-events-none filter hue-rotate-[90deg] saturate-200" 
          />

          {/* 5. MATRIX KÓD (Zobrazí sa len pri hoveri) */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            {isHovered && <MatrixRain />}
          </div>

          {/* 6. Scanline Skener */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100">
            <div className="w-full h-8 bg-green-400/30 blur-sm animate-scanline"></div>
            <div className="w-full h-[1px] bg-green-300 animate-scanline shadow-[0_0_10px_#4ade80]"></div>
          </div>

          {/* 7. Futuristické texty a zameriavače */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex flex-col">
              <span className="text-green-400 font-mono text-[10px] tracking-[0.2em] font-bold animate-pulse">SYS.OVERRIDE //</span>
              <span className="text-green-200/70 font-mono text-[8px] tracking-widest mt-1">RECONSTRUCTING_3D_VIEW</span>
            </div>
            <div className="w-8 h-8 border-r-2 border-b-2 border-green-400/80"></div>
          </div>
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-green-400/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-4 right-4 text-green-400/50 font-mono text-[8px] opacity-0 group-hover:opacity-100">REC ◉</div>
        </div>
      </motion.div>
    </div>
  );
}