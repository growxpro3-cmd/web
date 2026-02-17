import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft, Phone, MessageCircle, Zap, BarChart3, Star, Clock, CheckCircle2 } from 'lucide-react';
import { packages } from '../data/mockData';

const PackageDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const pkg = packages.find(p => p.slug === slug);
  const pageRef = useRef(null);
  const chartRef = useRef(null);
  const statsRef = useRef([]);
  const countersRef = useRef([]);

  useEffect(() => {
    if (!pkg) return;
    window.scrollTo(0, 0);

    const tl = gsap.timeline();
    tl.fromTo(pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );

    // Animate chart
    if (chartRef.current) {
      const path = chartRef.current.querySelector('.detail-chart-line');
      if (path) {
        const length = path.getTotalLength();
        gsap.fromTo(path,
          { strokeDasharray: length, strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', delay: 0.3 }
        );
      }
    }

    // Animate stats
    gsap.fromTo(statsRef.current.filter(Boolean),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.4 }
    );

    return () => tl.kill();
  }, [pkg]);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a1a' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Package not found</h2>
          <Link to="/" className="text-purple-400 hover:text-purple-300">Go back home</Link>
        </div>
      </div>
    );
  }

  // Generate chart data
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const base = 40000 + Math.sin(i * 0.5) * 3000 + Math.random() * 2000;
    return base;
  });

  const chartWidth = 600;
  const chartHeight = 200;
  const padding = 40;
  const min = Math.min(...chartData);
  const max = Math.max(...chartData);
  const range = max - min;

  const points = chartData.map((val, i) => {
    const x = padding + (i / (chartData.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - ((val - min) / range) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const statItems = [
    { icon: Zap, label: 'Daily Calls', value: pkg.dailyCalls },
    { icon: BarChart3, label: 'Analysis', value: pkg.analysis },
    { icon: Star, label: 'VIP Access', value: pkg.vipAccess },
    { icon: Clock, label: 'Coverage', value: pkg.coverage },
  ];

  return (
    <div ref={pageRef} className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a1a, #0d0d2b, #0a0a1a)' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>

        {/* Badge */}
        {pkg.badge && (
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{ background: '#22c55e', color: '#fff' }}>
            {pkg.badge}
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{pkg.name}</h1>
        <p className="text-gray-400 text-lg max-w-2xl mb-12">{pkg.description}</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
              <h3 className="text-white font-bold text-lg mb-4">Live Market Chart</h3>
              <div ref={chartRef}>
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full">
                  <defs>
                    <linearGradient id="detailChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid */}
                  {[0, 1, 2, 3, 4].map(i => {
                    const y = padding + (i / 4) * (chartHeight - padding * 2);
                    const val = Math.round(max - (range / 4) * i);
                    return (
                      <g key={i}>
                        <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="rgba(255,255,255,0.05)" />
                        <text x={padding - 5} y={y + 4} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end">{val}</text>
                      </g>
                    );
                  })}
                  {/* X labels */}
                  {[0, 4, 9, 14, 19, 24, 29].map(i => {
                    const x = padding + (i / 29) * (chartWidth - padding * 2);
                    return (
                      <text key={i} x={x} y={chartHeight - 10} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">
                        Day {i + 1}
                      </text>
                    );
                  })}
                  <polygon points={`${padding},${chartHeight - padding} ${points} ${chartWidth - padding},${chartHeight - padding}`} fill="url(#detailChartGrad)" />
                  <polyline className="detail-chart-line" points={points} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                  <polyline points={points} fill="none" stroke="#06b6d4" strokeWidth="6" opacity="0.15" />
                </svg>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {statItems.map((stat, i) => (
                <div
                  key={i}
                  ref={el => statsRef.current[i] = el}
                  className="p-4 rounded-xl text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139, 92, 246, 0.1)' }}
                >
                  <stat.icon size={24} className="mx-auto mb-2" style={{ color: pkg.color }} />
                  <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
                  <p className="text-white font-bold text-sm">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* What You Get */}
            <div className="mt-8 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
              <h3 className="text-xl font-bold text-white mb-6">What You Get</h3>
              <div className="space-y-4">
                {pkg.whatYouGet.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Package Summary Card */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl p-6"
              style={{ 
                background: `linear-gradient(135deg, ${pkg.color}10, rgba(15, 15, 30, 0.95))`,
                border: `1px solid ${pkg.color}30`,
                boxShadow: `0 20px 60px ${pkg.color}15`
              }}>
              <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold" style={{ color: pkg.color }}>{pkg.weeklyPrice}</span>
                  <span className="text-gray-400">/week</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg text-gray-400 line-through">{pkg.monthlyPrice}</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {pkg.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  className="w-full py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 text-white transition-all duration-300 hover:shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${pkg.color}, ${pkg.color}99)`,
                    boxShadow: `0 0 30px ${pkg.color}30`
                  }}
                >
                  <Phone size={16} />
                  CALL US NOW
                </button>
                <button
                  className="w-full py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 text-white transition-all duration-300"
                  style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}
                >
                  <MessageCircle size={16} />
                  Message on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-20" />
    </div>
  );
};

export default PackageDetail;
