import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TrendingUp, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';

const HeroSection = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    tl.fromTo(subtitleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    );

    tl.fromTo(ctaRef.current?.children ? Array.from(ctaRef.current.children) : [],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out' },
      '-=0.3'
    );

    tl.fromTo(statsRef.current?.children ? Array.from(statsRef.current.children) : [],
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
      '-=0.2'
    );

    // Animate chart line
    if (chartRef.current) {
      const path = chartRef.current.querySelector('.chart-line');
      if (path) {
        const length = path.getTotalLength();
        gsap.fromTo(path,
          { strokeDasharray: length, strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', delay: 0.5 }
        );
      }
    }

    return () => tl.kill();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #0d0d2b 50%, #0a0a1a 100%)' }}
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20" style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent)',
          filter: 'blur(80px)'
        }} />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full opacity-20" style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent)',
          filter: 'blur(80px)'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <div ref={titleRef}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm"
                style={{ background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <Zap size={14} className="text-purple-400" />
                <span className="text-purple-300">#1 Trading Signal Provider</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Trade Smarter with{' '}
                <span style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Expert Signals
                </span>
              </h1>
            </div>

            <p ref={subtitleRef} className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
              Join thousands of successful traders. Get real-time crypto, equity, commodity & forex signals with up to 92% accuracy.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={() => scrollTo('packages')}
                className="group px-8 py-3.5 rounded-full text-white font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)' }}
              >
                Start Trading
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo('markets')}
                className="px-8 py-3.5 rounded-full text-white font-semibold flex items-center gap-2 border border-white/20 hover:border-white/40 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <TrendingUp size={18} />
                Live Markets
              </button>
            </div>

            <div ref={statsRef} className="flex gap-8">
              {[
                { icon: Shield, label: 'SEBI Registered', value: 'Certified' },
                { icon: BarChart3, label: 'Accuracy', value: '92%+' },
                { icon: TrendingUp, label: 'Active Traders', value: '5000+' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(168, 85, 247, 0.15)' }}>
                    <stat.icon size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right chart */}
          <div ref={chartRef} className="hidden lg:block relative">
            <div className="relative p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-semibold">BTC/USDT</span>
                <span className="text-green-400 text-sm">+2.45%</span>
              </div>
              <svg viewBox="0 0 400 200" className="w-full">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,150 Q20,140 40,130 T80,110 T120,125 T160,90 T200,105 T240,75 T280,85 T320,55 T360,70 T400,40"
                  fill="url(#chartGradient)"
                  stroke="none"
                />
                <path
                  className="chart-line"
                  d="M0,150 Q20,140 40,130 T80,110 T120,125 T160,90 T200,105 T240,75 T280,85 T320,55 T360,70 T400,40"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                />
                {/* Glow line */}
                <path
                  d="M0,150 Q20,140 40,130 T80,110 T120,125 T160,90 T200,105 T240,75 T280,85 T320,55 T360,70 T400,40"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="6"
                  opacity="0.2"
                  filter="blur(4px)"
                />
              </svg>
              <div className="flex justify-between mt-4 text-xs text-gray-500">
                {['1D', '1W', '1M', '3M', '1Y'].map(t => (
                  <span key={t} className={t === '1M' ? 'text-purple-400' : ''}>{t}</span>
                ))}
              </div>

              {/* Floating price card */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-xl text-sm"
                style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 8px 30px rgba(168, 85, 247, 0.4)' }}>
                <span className="text-white font-bold">₹54,32,450</span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
              <TrendingUp size={28} className="text-cyan-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
