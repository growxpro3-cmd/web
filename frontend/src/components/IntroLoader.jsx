import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

const IntroLoader = ({ onComplete }) => {
  const [show, setShow] = useState(true);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const taglineRef = useRef(null);
  const particlesRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setShow(false);
            onComplete();
          }
        });
      }
    });

    // Glow pulse
    tl.fromTo(glowRef.current, 
      { scale: 0, opacity: 0 },
      { scale: 1.5, opacity: 0.6, duration: 0.8, ease: 'power2.out' }
    );

    // Logo entrance
    tl.fromTo(logoRef.current,
      { scale: 0, rotationY: -180, opacity: 0 },
      { scale: 1, rotationY: 0, opacity: 1, duration: 1, ease: 'back.out(1.7)' },
      '-=0.4'
    );

    // Tagline
    tl.fromTo(taglineRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    );

    // Particles animation
    const particles = particlesRef.current?.children;
    if (particles) {
      tl.fromTo(Array.from(particles),
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.6, duration: 0.5, stagger: 0.05, ease: 'power2.out' },
        '-=0.8'
      );
    }

    // Hold
    tl.to({}, { duration: 1 });

    // Glow pulse out
    tl.to(glowRef.current, { scale: 3, opacity: 0, duration: 0.6 });

    return () => tl.kill();
  }, [onComplete]);

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 50%, #0a0a1a 100%)' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              background: ['#a855f7', '#06b6d4', '#ec4899', '#f59e0b'][i % 4],
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4), rgba(6, 182, 212, 0.2), transparent)',
          filter: 'blur(40px)'
        }}
      />

      {/* Logo and tagline */}
      <div className="relative text-center z-10">
        <div ref={logoRef} className="mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              <span className="text-white">G</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              <span style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                GrowX
              </span>
              <span className="text-white">Pro</span>
            </h1>
          </div>
        </div>
        <p ref={taglineRef} className="text-xl md:text-2xl text-gray-400 tracking-widest uppercase">
          Grow Like a Pro
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default IntroLoader;
