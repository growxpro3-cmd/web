import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IntroLoader from './components/IntroLoader';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LiveMarket from './components/LiveMarket';
import WeOffer from './components/WeOffer';
import PackageSlider from './components/PackageSlider';
import PackageDetail from './components/PackageDetail';
import Testimonials from './components/Testimonials';
import TradingPartner from './components/TradingPartner';
import ConnectWithUs from './components/ConnectWithUs';
import Footer from './components/Footer';

const HomePage = ({ showIntro, setShowIntro }) => {
  return (
    <>
      {showIntro && <IntroLoader onComplete={() => setShowIntro(false)} />}
      <div style={{ opacity: showIntro ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        <Navbar />
        <HeroSection />
        <LiveMarket />
        <WeOffer />
        <PackageSlider />
        <Testimonials />
        <TradingPartner />
        <ConnectWithUs />
        <Footer />
      </div>
    </>
  );
};

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage showIntro={showIntro} setShowIntro={setShowIntro} />} />
          <Route path="/package/:slug" element={<PackageDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
