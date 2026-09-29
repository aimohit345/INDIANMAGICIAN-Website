import React, { useEffect, useState, useRef } from 'react';

export default function MagicalCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);
  
  const mouseRef = useRef({ x: -100, y: -100 });
  const ringRef = useRef({ x: -100, y: -100 });
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Spawn golden stardust particle trail on movement
      const now = Date.now();
      if (now - lastSpawnRef.current > 45) {
        lastSpawnRef.current = now;
        const newParticle = {
          id: Math.random().toString(36).substring(2, 9),
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          size: Math.random() * 4 + 2,
          color: Math.random() > 0.4 ? '#FFD700' : '#00e599',
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.8) * 1.5,
          opacity: 0.8,
        };

        setParticles((prev) => [...prev.slice(-18), newParticle]);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const checkHover = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[role="button"]') ||
        target.closest('.glass-card-hover')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', checkHover);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth animation loop for ring spring physics
    let animId;
    const animate = () => {
      // Lerp ring towards mouse
      ringRef.current.x += (mouseRef.current.x - ringRef.current.x) * 0.18;
      ringRef.current.y += (mouseRef.current.y - ringRef.current.y) * 0.18;

      setPos({ x: ringRef.current.x, y: ringRef.current.y });

      // Decay particles
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.035,
          }))
          .filter((p) => p.opacity > 0)
      );

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', checkHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {/* Soft Radial Spotlight Glow behind cursor */}
      <div
        className="absolute rounded-full transition-transform duration-300 ease-out will-change-transform"
        style={{
          width: isHovered ? '240px' : '160px',
          height: isHovered ? '240px' : '160px',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: 'translate(-50%, -50%)',
          background: isHovered
            ? 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, rgba(0, 229, 153, 0.08) 50%, rgba(0,0,0,0) 80%)'
            : 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, rgba(6, 44, 33, 0.05) 50%, rgba(0,0,0,0) 80%)',
        }}
      />

      {/* Floating Stardust / Sparkle Trail */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full will-change-transform shadow-[0_0_8px_currentColor]"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            color: p.color,
            opacity: p.opacity,
            transform: 'translate(-50%, -50%) scale(1)',
          }}
        />
      ))}


      {/* Golden Center Precision Dot */}
      <div
        className="absolute w-1.5 h-1.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700] transition-opacity duration-150"
        style={{
          left: `${mouseRef.current.x}px`,
          top: `${mouseRef.current.y}px`,
          transform: 'translate(-50%, -50%)',
          opacity: isHovered ? 0.3 : 1,
        }}
      />
    </div>
  );
}
