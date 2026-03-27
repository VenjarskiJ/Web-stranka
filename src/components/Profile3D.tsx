import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function Profile3D() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

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

  return (
    <div className="perspective-1000 w-full max-w-[280px] mx-auto" ref={cardRef}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full aspect-[3/4] rounded-2xl cursor-pointer group"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500/30 to-cyan-500/30 blur-2xl group-hover:blur-3xl transition-all duration-500" style={{ transform: "translateZ(-50px)" }}></div>
        <div className="absolute inset-0 rounded-2xl border border-black/10 dark:border-white/20 overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-sm group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500" style={{ transform: "translateZ(0px)" }}>
          {/* The user's uploaded photo */}
          <img 
            src="https://i1.rgstatic.net/ii/profile.image/11431281728263101-1763171443560_Q512/Jaroslav-Venjarski.jpg" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";
            }}
            alt="Jaroslav Venjarski" 
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-black/60 via-transparent to-transparent"></div>
        </div>
      </motion.div>
    </div>
  );
}
