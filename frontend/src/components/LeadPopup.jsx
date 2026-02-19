import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Gift, ChevronDown } from 'lucide-react';

const STORAGE_KEY = 'growxpro_popup_dismissed';

const LeadPopup = () => {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '', segment: '' });
  const [errors, setErrors] = useState({});
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  const segments = ['Commodity', 'Currency', 'Equity', 'Crypto'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (visible && modalRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(modalRef.current,
        { scale: 0.85, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.7)', delay: 0.1 }
      );
    }
  }, [visible]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      scale: 0.85, opacity: 0, y: 40, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        gsap.to(overlayRef.current, {
          opacity: 0, duration: 0.2,
          onComplete: () => {
            setVisible(false);
          }
        });
      }
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.mobile.trim()) errs.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) errs.mobile = 'Enter a valid 10-digit mobile number';
    if (!formData.segment) errs.segment = 'Please select a segment';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('https://formspree.io/f/mpqjlowb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          segment: formData.segment,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        localStorage.setItem(STORAGE_KEY, 'true');
      } else {
        setErrors({ form: 'Something went wrong. Please try again.' });
      }
    } catch {
      setErrors({ form: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #111128, #0d0d2b 40%, #0a0a1a)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          boxShadow: '0 40px 100px rgba(168, 85, 247, 0.2), 0 0 60px rgba(168, 85, 247, 0.08)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-b-full"
          style={{ background: 'linear-gradient(90deg, #a855f7, #ec4899, #a855f7)' }} />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <X size={16} className="text-gray-400" />
        </button>

        <div className="p-6 sm:p-8">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                  style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <Gift size={26} className="text-purple-400" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Get 3 <span style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FREE</span> Trades
                </h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Join now & start earning with expert signals
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={e => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: undefined }); }}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${errors.name ? '#ef4444' : 'rgba(139, 92, 246, 0.15)'}`,
                    }}
                    onFocus={e => e.target.style.borderColor = '#a855f7'}
                    onBlur={e => e.target.style.borderColor = errors.name ? '#ef4444' : 'rgba(139, 92, 246, 0.15)'}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
                </div>

                {/* Mobile */}
                <div>
                  <div className="flex items-center rounded-xl overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${errors.mobile ? '#ef4444' : 'rgba(139, 92, 246, 0.15)'}`,
                    }}>
                    <span className="px-3 text-sm text-gray-400 border-r border-white/10">+91</span>
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={formData.mobile}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, mobile: val });
                        setErrors({ ...errors, mobile: undefined });
                      }}
                      className="flex-1 px-3 py-3 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                    />
                  </div>
                  {errors.mobile && <p className="text-red-400 text-xs mt-1 ml-1">{errors.mobile}</p>}
                </div>

                {/* Segment Dropdown - native select for reliable mobile scroll picker */}
                <div className="relative">
                  <select
                    value={formData.segment}
                    onChange={e => {
                      setFormData({ ...formData, segment: e.target.value });
                      setErrors({ ...errors, segment: undefined });
                    }}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 appearance-none cursor-pointer"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${errors.segment ? '#ef4444' : 'rgba(139, 92, 246, 0.15)'}`,
                      color: formData.segment ? '#fff' : '#6b7280',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = '#a855f7'}
                    onBlur={e => e.target.style.borderColor = errors.segment ? '#ef4444' : 'rgba(139, 92, 246, 0.15)'}
                  >
                    <option value="" disabled style={{ background: '#1a1a3e', color: '#6b7280' }}>Select Segment</option>
                    {segments.map(seg => (
                      <option key={seg} value={seg} style={{ background: '#1a1a3e', color: '#fff' }}>{seg}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  {errors.segment && <p className="text-red-400 text-xs mt-1 ml-1">{errors.segment}</p>}
                </div>

                {/* Form error */}
                {errors.form && (
                  <p className="text-red-400 text-sm text-center">{errors.form}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:shadow-xl disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                    boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)'
                  }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Get Free Trades'
                  )}
                </button>
              </form>

              <p className="text-center text-gray-500 text-xs mt-4">
                We respect your privacy. No spam, ever.
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">You're In!</h3>
              <p className="text-gray-400 mb-6">
                Our team will contact you shortly with your free trading signals.
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
              >
                Awesome!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadPopup;
