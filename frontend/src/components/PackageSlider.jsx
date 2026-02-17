import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Phone, ChevronLeft, ChevronRight, Info, Crown, Zap, BarChart3, DollarSign } from 'lucide-react';
import { packages } from '../data/mockData';

const iconMap = {
  '⚡': Zap,
  '👑': Crown,
  '📊': BarChart3,
  '💱': DollarSign
};

const PackageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const sliderRef = useRef(null);

  const goTo = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const goNext = () => goTo((currentIndex + 1) % packages.length);
  const goPrev = () => goTo((currentIndex - 1 + packages.length) % packages.length);

  useEffect(() => {
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(sectionRef.current,
              { opacity: 0 },
              { opacity: 1, duration: 0.8, ease: 'power2.out' }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getCardStyle = (index) => {
    const diff = index - currentIndex;
    const wrappedDiff = ((diff + packages.length + Math.floor(packages.length / 2)) % packages.length) - Math.floor(packages.length / 2);
    
    const isCenter = wrappedDiff === 0;
    const isLeft = wrappedDiff === -1;
    const isRight = wrappedDiff === 1;
    const isFarLeft = wrappedDiff === -2 || wrappedDiff === packages.length - 2;
    const isFarRight = wrappedDiff === 2 || wrappedDiff === -(packages.length - 2);

    if (isCenter) {
      return {
        transform: 'translateX(0) scale(1) rotateY(0deg)',
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1)'
      };
    } else if (isLeft) {
      return {
        transform: 'translateX(-70%) scale(0.8) rotateY(15deg)',
        zIndex: 20,
        opacity: 0.7,
        filter: 'brightness(0.6)'
      };
    } else if (isRight) {
      return {
        transform: 'translateX(70%) scale(0.8) rotateY(-15deg)',
        zIndex: 20,
        opacity: 0.7,
        filter: 'brightness(0.6)'
      };
    } else if (isFarLeft) {
      return {
        transform: 'translateX(-130%) scale(0.6) rotateY(25deg)',
        zIndex: 10,
        opacity: 0.3,
        filter: 'brightness(0.4)'
      };
    } else if (isFarRight) {
      return {
        transform: 'translateX(130%) scale(0.6) rotateY(-25deg)',
        zIndex: 10,
        opacity: 0.3,
        filter: 'brightness(0.4)'
      };
    }
    return { transform: 'translateX(0) scale(0)', zIndex: 0, opacity: 0 };
  };

  return (
    <section id="packages" ref={sectionRef} className="relative py-20 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #0d0d2b 50%, #0a0a1a 100%)' }}>
      
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent)', filter: 'blur(100px)' }} />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our <span style={{ color: '#a855f7' }}>Packages</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Choose the perfect plan for your trading journey
          </p>
        </div>

        {/* 3D Slider */}
        <div className="relative h-[550px] md:h-[600px]" style={{ perspective: '1200px' }}>
          <div ref={sliderRef} className="relative w-full h-full flex items-center justify-center">
            {packages.map((pkg, index) => {
              const style = getCardStyle(index);
              const Icon = iconMap[pkg.icon] || Zap;
              const isCenter = index === currentIndex;

              return (
                <div
                  key={pkg.id}
                  className="absolute w-[320px] md:w-[380px] transition-all duration-700 ease-out"
                  style={{
                    ...style,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden p-6 md:p-8"
                    style={{
                      background: isCenter 
                        ? `linear-gradient(135deg, ${pkg.color}15, rgba(15, 15, 30, 0.95))`
                        : 'rgba(15, 15, 30, 0.9)',
                      border: `1px solid ${isCenter ? pkg.color + '40' : 'rgba(255,255,255,0.05)'}`,
                      boxShadow: isCenter 
                        ? `0 30px 80px ${pkg.color}30, 0 0 40px ${pkg.color}10, inset 0 1px 0 ${pkg.color}20`
                        : '0 10px 40px rgba(0,0,0,0.3)'
                    }}
                  >
                    {/* Badge */}
                    {pkg.badge && (
                      <div className="absolute -top-0 right-4">
                        <div className="px-4 py-1.5 rounded-b-lg text-xs font-bold"
                          style={{ background: '#facc15', color: '#000' }}>
                          {pkg.badge}
                        </div>
                      </div>
                    )}

                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                      style={{ background: `linear-gradient(135deg, ${pkg.color}30, ${pkg.color}10)` }}>
                      <Icon size={24} style={{ color: pkg.color }} />
                    </div>

                    {/* Name */}
                    <h3 className="text-2xl font-bold text-white mb-4">{pkg.name}</h3>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold" style={{ color: pkg.color }}>{pkg.weeklyPrice}</span>
                        <span className="text-gray-400 text-sm">/week</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-semibold text-gray-300">{pkg.monthlyPrice}</span>
                        <span className="text-gray-500 text-sm">/month</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {pkg.features.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: '#22c55e20' }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6L5 9L10 3" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <span className="text-gray-300 text-sm">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <button
                        className="w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg text-white"
                        style={{ 
                          background: `linear-gradient(135deg, ${pkg.color}, ${pkg.color}99)`,
                          boxShadow: `0 0 20px ${pkg.color}30`
                        }}
                      >
                        <Phone size={16} />
                        CALL US
                      </button>
                      <button
                        onClick={() => navigate(`/package/${pkg.slug}`)}
                        className="w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/10 text-white"
                        style={{ border: `1px solid ${pkg.color}40`, background: 'rgba(255,255,255,0.03)' }}
                      >
                        <Info size={16} />
                        GET DETAILS
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goPrev}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)' }}
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)' }}
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {packages.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                background: i === currentIndex ? '#a855f7' : 'rgba(255,255,255,0.2)',
                width: i === currentIndex ? '24px' : '10px'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackageSlider;
