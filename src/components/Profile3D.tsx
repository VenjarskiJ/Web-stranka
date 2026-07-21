import React from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Cpu, Network, Aperture } from 'lucide-react';

export default function Profile3D({ theme, lang }: { theme?: string, lang?: string }) {
  return (
    <div className="w-full max-w-[280px] mx-auto aspect-[3/4] relative flex items-center justify-center group perspective-1000">
      
      {/* Žiara na pozadí, ktorá reaguje na hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 blur-3xl group-hover:from-cyan-500/40 group-hover:to-purple-500/40 transition-all duration-700 animate-pulse"></div>
      
      {/* Levitujúci hlavný kontajner */}
      <motion.div 
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full border border-cyan-500/30 group-hover:border-cyan-400/60 bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_60px_rgba(6,182,212,0.3)] transition-all duration-500"
      >
        
        {/* Pozadie mriežky (ako v 3D softvéroch) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40"></div>
        
        {/* CSS Animácie pre rotáciu a skenovanie */}
        <style>{`
          @keyframes radarScan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(400%); }
          }
          .animate-radar { animation: radarScan 3s linear infinite; }
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow { animation: spinSlow 8s linear infinite; }
          .animate-spin-reverse { animation: spinSlow 12s linear infinite reverse; }
        `}</style>

        {/* Laserový skener bežiaci zhora nadol */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-cyan-400/10 to-cyan-400/30 border-b border-cyan-400 animate-radar pointer-events-none z-10"></div>

        {/* Centrálny abstraktný 3D/Vision vizuál */}
        <div className="relative w-40 h-40 flex items-center justify-center">
           {/* Vonkajší kruh */}
           <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
           
           {/* Rotujúce kruhy prístrojov */}
           <div className="absolute inset-2 border-t-2 border-r-2 border-purple-500/60 rounded-full animate-spin-slow"></div>
           <div className="absolute inset-6 border-b-2 border-l-2 border-dashed border-cyan-400/80 rounded-full animate-spin-reverse"></div>
           <div className="absolute inset-10 border border-cyan-300/40 rounded-full animate-spin-slow"></div>
           
           {/* Ikona jadra */}
           <div className="absolute inset-0 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-500">
              <Aperture size={48} className="animate-pulse" />
           </div>
        </div>

        {/* Futuristické texty a HUD (Head-Up Display) prvky */}
        <div className="absolute bottom-6 w-full px-6 flex justify-between items-end pointer-events-none">
           <div className="flex flex-col gap-1">
             <span className="text-cyan-400 font-mono text-[10px] tracking-[0.2em] font-bold">VISION_CORE_ONLINE</span>
             <span className="text-purple-400/80 font-mono text-[8px] tracking-widest">AWAITING_SPATIAL_DATA</span>
           </div>
           <Cpu size={18} className="text-cyan-400/70" />
        </div>

        {/* HUD zameriavače */}
        <div className="absolute top-6 left-6 text-cyan-500/50"><Network size={20} /></div>
        <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50"></div>
        <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50"></div>
        <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50"></div>

      </motion.div>
    </div>
  );
}