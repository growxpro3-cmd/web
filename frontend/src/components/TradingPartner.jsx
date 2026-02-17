import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Users, Target, TrendingUp, Award } from 'lucide-react';
import { tradingPartnerStats } from '../data/mockData';

const iconMap = [
  Users,
  Target,
  TrendingUp,
  Award
];

const Counter = ({ target, suffix, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: duration,
              ease: 'power2.out',
              onUpdate: () => setCount(Math.floor(obj.val))
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const TradingPartner = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(cardsRef.current.filter(Boolean),
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' }
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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Trading <span style={{ color: '#a855f7' }}>Partner</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Numbers that speak for our excellence
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {tradingPartnerStats.map((stat, i) => {
            const Icon = iconMap[i];
            return (
              <div
                key={stat.id}
                ref={el => cardsRef.current[i] = el}
                className="group p-6 md:p-8 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(139, 92, 246, 0.1)',
                }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(168, 85, 247, 0.15)' }}>
                  <Icon size={24} className="text-purple-400" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TradingPartner;
