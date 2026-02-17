import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { marketData } from '../data/mockData';

const MiniChart = ({ data, color, width = 120, height = 40 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const DetailChart = ({ data, color }) => {
  const width = 600;
  const height = 250;
  const padding = 40;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const val = min + (range / 4) * i;
    return Math.round(val);
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id={`areaGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {yLabels.map((label, i) => {
        const y = height - padding - (i / 4) * (height - padding * 2);
        return (
          <g key={i}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.05)" />
            <text x={padding - 8} y={y + 4} fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="end">{label}</text>
          </g>
        );
      })}
      {/* X labels */}
      {[0, 5, 10, 15, 20, 25, 29].map(i => {
        const x = padding + (i / (data.length - 1)) * (width - padding * 2);
        return (
          <text key={i} x={x} y={height - 10} fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="middle">
            Day {i + 1}
          </text>
        );
      })}
      <polygon points={areaPoints} fill={`url(#areaGrad-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Glow */}
      <polyline points={points} fill="none" stroke={color} strokeWidth="6" opacity="0.15" filter="blur(4px)" />
    </svg>
  );
};

const LiveMarket = () => {
  const [selectedMarket, setSelectedMarket] = useState(null);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const modalRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(cardsRef.current.filter(Boolean),
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
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

  useEffect(() => {
    if (selectedMarket && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [selectedMarket]);

  return (
    <section id="markets" ref={sectionRef} className="relative py-20 px-4"
      style={{ background: '#0a0a1a' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Live <span style={{ color: '#a855f7' }}>Market</span> Data
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Track real-time market movements across crypto, commodities, and forex
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketData.map((market, i) => (
            <div
              key={market.id}
              ref={el => cardsRef.current[i] = el}
              onClick={() => setSelectedMarket(market)}
              className="group p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(139, 92, 246, 0.1)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = market.color + '40'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.1)'}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background: market.color + '20', color: market.color }}>
                    {market.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{market.name}</h3>
                    <span className="text-gray-500 text-xs">{market.symbol}</span>
                  </div>
                </div>
                {market.isPositive ? 
                  <TrendingUp size={18} className="text-green-400" /> : 
                  <TrendingDown size={18} className="text-red-400" />
                }
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white font-bold text-lg">{market.price}</p>
                  <p className={`text-sm font-medium ${market.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {market.change}
                  </p>
                </div>
                <MiniChart data={market.chartData} color={market.isPositive ? '#22c55e' : '#ef4444'} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Modal */}
      {selectedMarket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
          onClick={() => setSelectedMarket(null)}>
          <div ref={modalRef}
            className="w-full max-w-2xl p-6 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #0d0d2b, #1a1a3e)', border: '1px solid rgba(139, 92, 246, 0.2)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                  style={{ background: selectedMarket.color + '20', color: selectedMarket.color }}>
                  {selectedMarket.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">{selectedMarket.name}</h3>
                  <span className="text-gray-400 text-sm">{selectedMarket.symbol}</span>
                </div>
              </div>
              <button onClick={() => setSelectedMarket(null)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-white">{selectedMarket.price}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedMarket.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {selectedMarket.change}
              </span>
            </div>
            <DetailChart data={selectedMarket.chartData} color={selectedMarket.color || '#a855f7'} />
          </div>
        </div>
      )}
    </section>
  );
};

export default LiveMarket;
