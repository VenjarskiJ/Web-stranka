import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    
    // Easter Egg States
    let typedKeys = '';
    let isMatrixMode = false;
    let isMathMode = false;
    let isCrazyMathMode = false;
    let isGalaxyMode = false;
    let isConfettiMode = false;
    let galaxyTheme = 0;

    // Matrix setup
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~abcdefghijklmnopqrstuvwxyz';
    const fontSize = 14;
    const drops: number[] = [];
    let columns = 0;

    const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      typedKeys += e.key.toLowerCase();
      if (typedKeys.length > 15) {
        typedKeys = typedKeys.slice(-15);
      }
      
      if (typedKeys.includes('matrix')) {
        isMatrixMode = !isMatrixMode;
        typedKeys = '';
        if (isMatrixMode) {
          isMathMode = false; isCrazyMathMode = false; isGalaxyMode = false; isConfettiMode = false;
          columns = Math.floor(canvas.width / fontSize);
          drops.length = 0;
          for (let i = 0; i < columns; i++) {
            drops[i] = 1;
          }
          showToast('Matrix Mode Activated 🟢 (Move mouse to repel)');
        } else {
          showToast('Matrix Mode Deactivated');
        }
      }
      if (typedKeys.includes('math')) {
        isMathMode = !isMathMode;
        typedKeys = '';
        if (isMathMode) {
          isMatrixMode = false; isCrazyMathMode = false; isGalaxyMode = false; isConfettiMode = false;
          showToast('Math Mode Activated 📐 (Move your mouse!)');
        } else {
          showToast('Math Mode Deactivated');
        }
      }
      if (typedKeys.includes('crazy')) {
        isCrazyMathMode = !isCrazyMathMode;
        typedKeys = '';
        if (isCrazyMathMode) {
          isMatrixMode = false; isMathMode = false; isGalaxyMode = false; isConfettiMode = false;
          showToast('Crazy Math Mode Activated 📈🤯 (Type "crazy" to exit)');
        } else {
          showToast('Crazy Math Mode Deactivated');
        }
      }
      if (typedKeys.includes('galaxy')) {
        isGalaxyMode = !isGalaxyMode;
        typedKeys = '';
        if (isGalaxyMode) {
          isMatrixMode = false; isMathMode = false; isCrazyMathMode = false; isConfettiMode = false;
          showToast('Galaxy Mode Activated 🌌 (Click to add stars, press "c" for themes)');
        } else {
          showToast('Galaxy Mode Deactivated');
        }
      }
      if (isGalaxyMode && e.key === 'c') {
        galaxyTheme = (galaxyTheme + 1) % 4;
        const themeNames = ['Rainbow Nebula 🌈', 'Solar Flare ☀️', 'Deep Space 🌌', 'Emerald Void ❇️'];
        showToast(`Theme changed: ${themeNames[galaxyTheme]}`);
        typedKeys = '';
      }
      if (typedKeys.includes('confetti')) {
        isConfettiMode = !isConfettiMode;
        typedKeys = '';
        if (isConfettiMode) {
          isMatrixMode = false; isMathMode = false; isCrazyMathMode = false; isGalaxyMode = false;
          initConfetti();
          showToast('Confetti Mode Activated 🎉 (Type "confetti" to exit)');
        } else {
          showToast('Confetti Mode Deactivated');
        }
      }
      if (typedKeys.includes('default')) {
        isMatrixMode = false;
        isMathMode = false;
        isCrazyMathMode = false;
        isGalaxyMode = false;
        isConfettiMode = false;
        typedKeys = '';
        showToast('Returned to Default Theme 🏠');
      }
      if (typedKeys.includes('help') || e.key === '?' || (e.key === 'h' && !typedKeys.endsWith('math'))) {
        setShowHelp(prev => !prev);
        typedKeys = '';
      }
    };

    // Mouse interaction
    const mouse = { x: -1000, y: -1000, clicked: false };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleMouseClick = () => {
      if (isGalaxyMode) {
        const clusterColorOffset = Math.random() * 360;
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: mouse.x,
            y: mouse.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: Math.random() * 2 + 0.5,
            angle: Math.random() * Math.PI * 2,
            dist: Math.random() * 150 + 10,
            centerX: mouse.x,
            centerY: mouse.y,
            colorOffset: clusterColorOffset,
            isCluster: true
          });
        }
        showToast('Star Cluster Created! ✨');
      } else {
        for (let i = 0; i < 20; i++) {
          particles.push({
            x: mouse.x,
            y: mouse.y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            radius: Math.random() * 4 + 2,
            life: 1.0
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleMouseClick);
    window.addEventListener('keydown', handleKeyDown);

    // Particle system
    const numParticles = 100;
    const particles: { x: number; y: number; vx: number; vy: number; radius: number; life?: number; angle?: number; dist?: number; centerX?: number; centerY?: number; colorOffset?: number; isCluster?: boolean }[] = [];

    // Confetti system
    const confettiParticles: { x: number; y: number; vx: number; vy: number; color: string; size: number; rotation: number; rotationSpeed: number; life: number }[] = [];
    const confettiColors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

    // Floating shapes (for default mode)
    const shapes: { x: number; y: number; type: number; size: number; rot: number; vRot: number; vx: number; vy: number }[] = [];

    const initShapes = () => {
      shapes.length = 0;
      for (let i = 0; i < 15; i++) {
        shapes.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          type: Math.floor(Math.random() * 3), // 0: circle, 1: triangle, 2: square
          size: Math.random() * 20 + 10,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.05,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }
    };

    const initConfetti = () => {
      confettiParticles.length = 0;
      for (let i = 0; i < 200; i++) {
        confettiParticles.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          vx: (Math.random() - 0.5) * 30,
          vy: (Math.random() - 0.5) * 30,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          size: Math.random() * 10 + 5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          life: 1.0
        });
      }
    };

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          radius: Math.random() * 2 + 1,
          angle: Math.random() * Math.PI * 2,
          dist: Math.random() * 300 + 50
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
      initShapes();
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      if (isMatrixMode) {
        ctx.fillStyle = isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
          const x = i * fontSize;
          const y = drops[i] * fontSize;
          
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let drawX = x;
          let drawY = y;
          
          if (dist < 150) {
            const angle = Math.atan2(dy, dx);
            const push = (150 - dist) * 0.3;
            drawX += Math.cos(angle) * push;
            drawY += Math.sin(angle) * push;
            ctx.fillStyle = isDarkMode ? '#FFF' : '#000';
          } else {
            ctx.fillStyle = isDarkMode ? '#0F0' : '#0A0';
          }

          const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
          ctx.fillText(text, drawX, drawY);
          
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        
        time += 0.02;
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerY = canvas.height / 2;
      const width = canvas.width;
      const mouseActive = mouse.x !== -1000 && mouse.y !== -1000;

      if (isGalaxyMode) {
        // Galaxy Mode
        const targetX = mouseActive ? mouse.x : width / 2;
        const targetY = mouseActive ? mouse.y : centerY;
        
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          
          if (p.life !== undefined && !p.isCluster) {
            p.life -= 0.02;
            p.x += p.vx; p.y += p.vy;
            if (p.life <= 0) { particles.splice(i, 1); continue; }
          } else {
            // Orbit logic
            if (p.angle === undefined) p.angle = Math.random() * Math.PI * 2;
            if (p.dist === undefined) p.dist = Math.random() * 300 + 50;
            
            const speed = p.isCluster ? 0.01 : 0.02;
            p.angle += speed * (100 / p.dist);
            
            let cX = p.centerX !== undefined ? p.centerX : targetX;
            let cY = p.centerY !== undefined ? p.centerY : targetY;

            // Gravitational pull from mouse for clusters
            if (p.isCluster && mouseActive) {
                const dx = mouse.x - cX;
                const dy = mouse.y - cY;
                const distToMouse = Math.sqrt(dx*dx + dy*dy);
                if (distToMouse < 400) {
                    cX += dx * 0.015;
                    cY += dy * 0.015;
                    p.centerX = cX;
                    p.centerY = cY;
                }
            }
            
            // Smoothly move towards orbit position
            const targetPx = cX + Math.cos(p.angle) * p.dist;
            const targetPy = cY + Math.sin(p.angle) * p.dist;
            
            p.x += (targetPx - p.x) * 0.05;
            p.y += (targetPy - p.y) * 0.05;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (p.life !== undefined && !p.isCluster ? 2 : 1.5), 0, Math.PI * 2);
          
          let hue = (p.angle || 0) * 180 / Math.PI + time * 50;
          if (p.colorOffset !== undefined) {
             hue = p.colorOffset + (p.angle || 0) * 30;
          }

          let saturation = '80%';
          let lightness = '60%';
          
          if (galaxyTheme === 1) { // Fire/Gold
             hue = (hue % 60) + 10; 
          } else if (galaxyTheme === 2) { // Deep Space
             hue = (hue % 80) + 220;
             lightness = '70%';
          } else if (galaxyTheme === 3) { // Emerald
             hue = (hue % 60) + 120;
          }

          ctx.fillStyle = p.life !== undefined && !p.isCluster
            ? `rgba(255, 255, 255, ${p.life})` 
            : `hsla(${hue}, ${saturation}, ${lightness}, 0.8)`;
          ctx.fill();
        }
        
        time += 0.02;
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      if (isConfettiMode) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = confettiParticles.length - 1; i >= 0; i--) {
          const p = confettiParticles[i];
          
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.5; // gravity
          p.rotation += p.rotationSpeed;
          p.life -= 0.005;
          
          if (p.life <= 0) {
            confettiParticles.splice(i, 1);
            continue;
          }
          
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
        
        // Add new particles occasionally to keep it going
        if (Math.random() > 0.9 && confettiParticles.length < 300) {
          confettiParticles.push({
            x: Math.random() * window.innerWidth,
            y: -20,
            vx: (Math.random() - 0.5) * 10,
            vy: Math.random() * 5 + 2,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            size: Math.random() * 10 + 5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            life: 1.0
          });
        }
        
        time += 0.02;
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // Normal, Math, or Crazy Mode
      
      // 1. Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        if (mouseActive) {
          const dxMouse = p.x - mouse.x;
          const dyMouse = p.y - mouse.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distMouse < 150) {
            p.x += dxMouse * 0.02;
            p.y += dyMouse * 0.02;
          }
        }

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        if (p.life !== undefined) {
          p.life -= 0.02;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.life !== undefined 
          ? `rgba(6, 182, 212, ${p.life})` 
          : (isDarkMode ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.2)');
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = p.life !== undefined ? p.life * 0.5 : 0.15 * (1 - dist / 150);
            ctx.strokeStyle = isDarkMode ? `rgba(6, 182, 212, ${opacity})` : `rgba(6, 182, 212, ${opacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 2. Waves
      const drawWave = (offsetY: number, colorDark: string, colorLight: string, fn: (x: number) => number) => {
        ctx.beginPath();
        ctx.strokeStyle = isDarkMode ? colorDark : colorLight;
        ctx.lineWidth = isCrazyMathMode ? 3 : 2;
        for (let x = 0; x < width; x += 2) {
          const y = centerY + offsetY + fn(x);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      const mousePhaseX = mouseActive ? (mouse.x / width) * Math.PI * 4 : 0;
      const mouseAmpY = mouseActive ? (mouse.y / canvas.height) * 2 : 1;

      if (isCrazyMathMode) {
        // Crazy Mode: Multi-layered chaotic spirograph
        for (let i = 0; i < 3; i++) {
          drawWave(0, `hsla(${time * 50 + i * 120}, 80%, 60%, 0.5)`, `hsla(${time * 50 + i * 120}, 80%, 50%, 0.3)`, (x) => {
            const phase = x * 0.02 + time * (i + 1) + mousePhaseX;
            return Math.sin(phase) * 100 * mouseAmpY * Math.cos(x * 0.01 - time);
          });
        }
      } else if (isMathMode) {
        // Math Mode: Beautiful 3D rotating wave
        drawWave(0, 'rgba(56, 189, 248, 0.6)', 'rgba(56, 189, 248, 0.4)', (x) => {
          const phase = x * 0.01 + time + mousePhaseX;
          return Math.sin(phase) * 150 * mouseAmpY * Math.sin(time * 0.5 + x * 0.005);
        });
        drawWave(0, 'rgba(168, 85, 247, 0.6)', 'rgba(168, 85, 247, 0.4)', (x) => {
          const phase = x * 0.01 + time + Math.PI / 2 + mousePhaseX;
          return Math.sin(phase) * 150 * mouseAmpY * Math.sin(time * 0.5 + x * 0.005);
        });
      } else {
        // Normal Mode: Subtle signals
        
        // Background Grid
        ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 50;
        const offsetX = (time * 10) % gridSize;
        const offsetY = (time * 10) % gridSize;
        ctx.beginPath();
        for (let x = offsetX; x < width; x += gridSize) {
          ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
        }
        for (let y = offsetY; y < canvas.height; y += gridSize) {
          ctx.moveTo(0, y); ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Floating Shapes
        ctx.lineWidth = 1;
        shapes.forEach(s => {
          s.x += s.vx; s.y += s.vy; s.rot += s.vRot;
          if (s.x < -50) s.x = canvas.width + 50;
          if (s.x > canvas.width + 50) s.x = -50;
          if (s.y < -50) s.y = canvas.height + 50;
          if (s.y > canvas.height + 50) s.y = -50;

          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rot);
          ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
          ctx.beginPath();
          if (s.type === 0) {
            ctx.arc(0, 0, s.size, 0, Math.PI * 2);
          } else if (s.type === 1) {
            ctx.moveTo(0, -s.size);
            ctx.lineTo(s.size * 0.866, s.size * 0.5);
            ctx.lineTo(-s.size * 0.866, s.size * 0.5);
            ctx.closePath();
          } else {
            ctx.rect(-s.size/2, -s.size/2, s.size, s.size);
          }
          ctx.stroke();
          ctx.restore();
        });

        drawWave(-150, 'rgba(56, 189, 248, 0.2)', 'rgba(56, 189, 248, 0.1)', (x) => {
          const distToMouseX = Math.abs(x - mouse.x);
          const waveDistortion = distToMouseX < 200 ? Math.cos(distToMouseX * 0.015) * 20 : 0;
          return Math.sin(x * 0.01 + time) * 50 + waveDistortion;
        });

        drawWave(0, 'rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.1)', (x) => {
          let y = 0;
          for (let n = 1; n <= 9; n += 2) y += Math.sin(n * (x * 0.01 + time * 1.5)) / n;
          return y * 60;
        });

        // ECG / Heartbeat Signal
        ctx.beginPath();
        ctx.strokeStyle = isDarkMode ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.2)';
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x += 2) {
          const localX = (x - time * 150) % 400;
          let y = centerY + 50;
          if (localX > 0 && localX < 20) {
             y -= Math.sin(localX * Math.PI / 20) * 10; // P wave
          } else if (localX > 40 && localX < 50) {
             y += 10; // Q
          } else if (localX >= 50 && localX < 60) {
             y -= 80; // R
          } else if (localX >= 60 && localX < 70) {
             y += 25; // S
          } else if (localX > 90 && localX < 130) {
             y -= Math.sin((localX - 90) * Math.PI / 40) * 15; // T wave
          }
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Digital signal
        ctx.beginPath();
        ctx.strokeStyle = isDarkMode ? 'rgba(236, 72, 153, 0.25)' : 'rgba(236, 72, 153, 0.15)';
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x += 30) {
          const y = centerY + 150 + Math.sin(x * 0.015 - time) * 40;
          ctx.moveTo(x, centerY + 150);
          ctx.lineTo(x, y);
          ctx.arc(x, y, 3, 0, Math.PI * 2);
        }
        ctx.stroke();

        // Interactive Section Nodes (Data Nexuses)
        const sectionIds = ['about', 'skills', 'research', 'publications', 'contact'];
        sectionIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            // Check if section is visible in viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              // Position node on the left or right side depending on the section
              const index = sectionIds.indexOf(id);
              const isLeft = index % 2 === 0;
              
              const nodeX = isLeft ? Math.min(200, rect.width * 0.15) : Math.max(rect.width - 200, rect.width * 0.85);
              const nodeY = rect.top + rect.height / 2;
              
              const dx = mouse.x - nodeX;
              const dy = mouse.y - nodeY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              // Draw the node glow
              ctx.beginPath();
              ctx.arc(nodeX, nodeY, 200, 0, Math.PI * 2);
              const gradient = ctx.createRadialGradient(nodeX, nodeY, 0, nodeX, nodeY, 200);
              gradient.addColorStop(0, isDarkMode ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168, 85, 247, 0.08)');
              gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
              ctx.fillStyle = gradient;
              ctx.fill();

              // Draw connecting lines to mouse if close
              if (dist < 400) {
                ctx.beginPath();
                ctx.moveTo(nodeX, nodeY);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = isDarkMode ? `rgba(168, 85, 247, ${1 - dist/400})` : `rgba(168, 85, 247, ${0.6 - dist/600})`;
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Draw orbiting particles around the node that react to mouse
                for(let i=0; i<8; i++) {
                  const angle = time * (0.5 + i*0.1) + (i * Math.PI * 2 / 8);
                  const orbitRadius = 60 + Math.sin(time * 3 + i) * 15 + (400 - dist) * 0.15;
                  const px = nodeX + Math.cos(angle) * orbitRadius;
                  const py = nodeY + Math.sin(angle) * orbitRadius;
                  
                  ctx.beginPath();
                  ctx.arc(px, py, 3, 0, Math.PI * 2);
                  ctx.fillStyle = isDarkMode ? 'rgba(56, 189, 248, 0.8)' : 'rgba(56, 189, 248, 0.6)';
                  ctx.fill();
                  
                  // Connect orbit particles to mouse
                  ctx.beginPath();
                  ctx.moveTo(px, py);
                  ctx.lineTo(mouse.x, mouse.y);
                  ctx.strokeStyle = isDarkMode ? `rgba(56, 189, 248, ${(1 - dist/400) * 0.4})` : `rgba(56, 189, 248, ${(1 - dist/400) * 0.2})`;
                  ctx.lineWidth = 1;
                  ctx.stroke();
                  
                  // Connect orbit particles to center
                  ctx.beginPath();
                  ctx.moveTo(px, py);
                  ctx.lineTo(nodeX, nodeY);
                  ctx.strokeStyle = isDarkMode ? `rgba(168, 85, 247, 0.3)` : `rgba(168, 85, 247, 0.15)`;
                  ctx.stroke();
                }
              } else {
                // Idle orbiting particles
                for(let i=0; i<8; i++) {
                  const angle = time * (0.5 + i*0.1) + (i * Math.PI * 2 / 8);
                  const orbitRadius = 60 + Math.sin(time * 3 + i) * 15;
                  const px = nodeX + Math.cos(angle) * orbitRadius;
                  const py = nodeY + Math.sin(angle) * orbitRadius;
                  
                  ctx.beginPath();
                  ctx.arc(px, py, 2, 0, Math.PI * 2);
                  ctx.fillStyle = isDarkMode ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.2)';
                  ctx.fill();
                  
                  // Connect orbit particles to center
                  ctx.beginPath();
                  ctx.moveTo(px, py);
                  ctx.lineTo(nodeX, nodeY);
                  ctx.strokeStyle = isDarkMode ? `rgba(168, 85, 247, 0.1)` : `rgba(168, 85, 247, 0.05)`;
                  ctx.stroke();
                }
              }
              
              // Core of the node
              ctx.beginPath();
              ctx.arc(nodeX, nodeY, 6 + Math.sin(time * 4) * 2, 0, Math.PI * 2);
              ctx.fillStyle = isDarkMode ? 'rgba(168, 85, 247, 0.8)' : 'rgba(168, 85, 247, 0.5)';
              ctx.fill();
              ctx.beginPath();
              ctx.arc(nodeX, nodeY, 12 + Math.sin(time * 4 + Math.PI) * 2, 0, Math.PI * 2);
              ctx.strokeStyle = isDarkMode ? 'rgba(56, 189, 248, 0.5)' : 'rgba(56, 189, 248, 0.3)';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      }

      time += 0.02;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none" />
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          >
            <div 
              className="glass p-8 rounded-3xl max-w-md w-full border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">Easter Eggs Menu</h3>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
                  <span className="text-pink-500 font-bold">matrix</span>
                  <span className="text-slate-600 dark:text-white/70">Enter the Matrix</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
                  <span className="text-cyan-500 font-bold">math</span>
                  <span className="text-slate-600 dark:text-white/70">3D Rotating Waves</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
                  <span className="text-purple-500 font-bold">crazy</span>
                  <span className="text-slate-600 dark:text-white/70">Chaotic Spirograph</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
                  <span className="text-blue-500 font-bold">galaxy</span>
                  <span className="text-slate-600 dark:text-white/70">Galaxy (Click/Press 'c')</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
                  <span className="text-green-500 font-bold">confetti</span>
                  <span className="text-slate-600 dark:text-white/70">Confetti Explosion</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
                  <span className="text-orange-500 font-bold">default</span>
                  <span className="text-slate-600 dark:text-white/70">Return to Normal</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-500 font-bold">h / ? / help</span>
                  <span className="text-slate-600 dark:text-white/70">Toggle this menu</span>
                </div>
              </div>
              <button 
                onClick={() => setShowHelp(false)}
                className="mt-8 w-full py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-bold hover:scale-105 transition-transform"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 px-6 py-3 rounded-full glass bg-black/80 text-white font-mono text-sm border border-white/20 shadow-2xl backdrop-blur-md"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
