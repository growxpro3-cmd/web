import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../data/mockData';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  const goNext = () => setCurrent((current + 1) % testimonials.length);
  const goPrev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [current]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [current]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(sectionRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
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

  const t = testimonials[current];

  return (
    <section id="about" ref={sectionRef} className="relative py-20 px-4"
      style={{ background: '#0a0a1a' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Client <span style={{ color: '#a855f7' }}>Testimonials</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            What our traders say about us
          </p>
        </div>

        <div className="relative">
          <div ref={cardRef} className="p-8 md:p-12 rounded-2xl text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
            
            <Quote size={40} className="mx-auto mb-6 opacity-20" style={{ color: '#a855f7' }} />
            
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
              "{t.content}"
            </p>

            <div className="flex justify-center mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} fill={i < t.rating ? '#facc15' : 'transparent'}
                  stroke={i < t.rating ? '#facc15' : '#4b5563'} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)' }}>
                {t.avatar}
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">{t.name}</p>
                <p className="text-gray-400 text-sm">{t.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <button onClick={goPrev}
            className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button onClick={goNext}
            className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                background: i === current ? '#a855f7' : 'rgba(255,255,255,0.2)',
                width: i === current ? '24px' : '10px'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
