import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Bitcoin, DollarSign, Gem, BarChart3 } from 'lucide-react';
import { weOfferCategories } from '../data/mockData';

const iconMap = {
  bitcoin: Bitcoin,
  currency: DollarSign,
  commodity: Gem,
  equity: BarChart3
};

const WeOffer = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(titleRef.current,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
            );
            gsap.fromTo(cardsRef.current.filter(Boolean),
              { y: 60, opacity: 0, rotateX: 15 },
              { y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
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

  return (
    <section ref={sectionRef} className="relative py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #0d0d2b 50%, #0a0a1a 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            We <span style={{ color: '#a855f7' }}>Offer</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Expert trading signals across all major markets
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {weOfferCategories.map((cat, i) => {
            const Icon = iconMap[cat.icon];
            return (
              <div
                key={cat.id}
                ref={el => cardsRef.current[i] = el}
                className="group relative p-8 rounded-2xl text-center cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(139, 92, 246, 0.1)',
                  perspective: '1000px',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.borderColor = cat.color + '50';
                  e.currentTarget.style.boxShadow = `0 20px 60px ${cat.color}20`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at center, ${cat.color}10, transparent)` }} />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                    style={{ 
                      background: cat.color + '15',
                      border: `1px solid ${cat.color}30`,
                      boxShadow: `0 0 20px ${cat.color}10`
                    }}>
                    <Icon size={28} style={{ color: cat.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{cat.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{cat.description}</p>
                </div>

                {/* Border glow animation */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, ${cat.color}20, transparent, ${cat.color}20, transparent)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '1px'
                  }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WeOffer;
