import { ArrowRight, Leaf, Camera, MapPin, BarChart3, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/3444156-removebg-preview.png';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <style>
        {`
          .corner-ribbon {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(90deg, #1a1a1a, #2DB550, #1a1a1a);
            color: white;
            padding: 10px 0;
            font-weight: 800;
            font-size: 13px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            z-index: 100;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            overflow: hidden;
            white-space: nowrap;
            display: flex;
          }
          @media (min-width: 768px) {
            .corner-ribbon {
              top: 50px;
              left: -120px;
              width: 500px;
              padding: 14px 0;
              font-size: 14px;
              transform: rotate(-45deg);
              box-shadow: 0 8px 30px rgba(0,0,0,0.5);
            }
          }
          .corner-ribbon-content {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 16s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .landing-hero {
            background: #0a0a0a;
            position: relative;
            overflow: hidden;
          }
          .landing-hero::before {
            content: '';
            position: absolute;
            top: -200px;
            left: -100px;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(45,181,80,0.25) 0%, transparent 70%);
            pointer-events: none;
          }
          .landing-hero::after {
            content: '';
            position: absolute;
            bottom: -150px;
            right: -100px;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(45,181,80,0.15) 0%, transparent 70%);
            pointer-events: none;
          }
          .landing-nav { display: flex; }
          .hide-on-mobile { display: none !important; }
          @media (min-width: 768px) {
            .hide-on-mobile { display: flex !important; }
            .hide-on-mobile-inline { display: inline-block !important; }
          }
          .landing-mobile-header { display: none; }
          
          .stat-card {

            text-align: center;
            padding: 32px 16px;
          }
          .stat-number {
            font-size: 48px;
            font-weight: 800;
            color: #2DB550;
            line-height: 1;
          }
          @media (max-width: 767px) {
            .stat-number { font-size: 36px; }
            .approach-grid { grid-template-columns: 1fr !important; }
          }
          .approach-card {
            background: #1a1a1a;
            border-radius: 20px;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .approach-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(45,181,80,0.15);
          }
          .quote-section {
            background: #f5f8f6;
            padding: 80px 24px;
          }
          @media (max-width: 767px) {
            .quote-section { padding: 48px 16px; }
          }
        `}
      </style>

      {/* Tilted Corner Ribbon */}
      <div className="corner-ribbon">
        <div className="corner-ribbon-content">
          HACKATHON The Climate Change-Makers Challenge: 2026 BY One4Earth &nbsp;&nbsp;&nbsp; HACKATHON The Climate Change-Makers Challenge: 2026 BY One4Earth
        </div>
      </div>

      {/* ===== HERO SECTION (Dark) ===== */}
      <div className="landing-hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Unified Navbar */}
        <header className="landing-nav" style={{
          padding: '24px',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
        }}>
          <span style={{ fontSize: '28px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
            eco<span style={{ color: '#2DB550' }}>loop</span>
          </span>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a href="#mission" style={{ color: '#ccc', fontWeight: 500, fontSize: '15px', textDecoration: 'none', transition: 'color 0.2s' }}>Our Mission</a>
            <a href="#approach" className="hide-on-mobile" style={{ color: '#ccc', fontWeight: 500, fontSize: '15px', textDecoration: 'none', transition: 'color 0.2s' }}>How it Works</a>
            <a href="#stats" style={{ color: '#ccc', fontWeight: 500, fontSize: '15px', textDecoration: 'none', transition: 'color 0.2s' }}>Impact</a>
            <button
              onClick={() => navigate('/auth')}
              className="hide-on-mobile"
              style={{
                background: '#2DB550',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Get Started
            </button>
          </nav>
        </header>

        {/* Hero Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '48px',
          padding: '40px 48px 80px',
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* Left: Text */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(45,181,80,0.15)',
              color: '#2DB550',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              alignSelf: 'flex-start',
              border: '1px solid rgba(45,181,80,0.3)',
            }}>
              <Leaf size={14} /> AI-Powered Climate Action
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.05,
              letterSpacing: '-2px',
              margin: 0,
            }}>
              <span style={{ color: '#2DB550' }}>EMPOWERING</span> RESILIENT FUTURE & TRANSFORMING COMPLEX PROBLEMS INTO{' '}
              <span style={{ color: '#2DB550' }}>CLIMATE ACTION.</span>
            </h1>

            <p style={{ color: '#999', fontSize: '17px', lineHeight: 1.7, maxWidth: '500px' }}>
              Track your plastic cleanup, verify your impact instantly with Gemini AI, and turn everyday litter collection into measurable environmental change.
            </p>

            {/* Icon Badges Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[
                { icon: <Camera size={16} />, label: 'AI Scan' },
                { icon: <MapPin size={16} />, label: 'GPS Track' },
                { icon: <BarChart3 size={16} />, label: 'Analytics' },
                { icon: <Shield size={16} />, label: 'Verified' },
              ].map((b, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  padding: '8px 16px', borderRadius: '24px', color: '#ccc', fontSize: '13px', fontWeight: 500,
                }}>
                  {b.icon} {b.label}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/auth')}
                className="hover-lift"
                style={{
                  background: '#2DB550',
                  color: 'white',
                  padding: '18px 36px',
                  borderRadius: '16px',
                  fontSize: '17px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                Get Started <ArrowRight size={20} />
              </button>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                color: '#888', fontSize: '13px', fontWeight: 500,
              }}>
                📱 Mobile required for missions
              </div>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: '-20%',
              background: 'radial-gradient(circle, rgba(45,181,80,0.2), transparent 70%)',
              pointerEvents: 'none', borderRadius: '50%',
            }} />
            <img
              src={heroImg}
              alt="Plastic Cleanup Hero"
              style={{
                width: '100%',
                maxWidth: '420px',
                objectFit: 'cover',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                borderRadius: '24px',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>
        </div>
      </div>

      {/* ===== APPROACH SECTION ===== */}
      <div id="approach" style={{ background: '#111', padding: '80px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 700, color: 'white', margin: '0 0 8px' }}>Our Approach to Climate Challenges</h2>
              <p style={{ color: '#888', fontSize: '15px', maxWidth: '500px' }}>Simple, powerful, and AI-verified cleanup missions.</p>
            </div>
            <span style={{ color: '#2DB550', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>// ECOLOOP ACTIONS 2026</span>
          </div>

          <div className="approach-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { step: 'STEP 1', title: 'ASSESS', desc: 'Head outside with your phone. Our GPS-powered tracker maps your cleanup route in real-time, measuring every meter you cover.' },
              { step: 'STEP 2', title: 'ENGAGE', desc: 'Snap a photo of collected plastic waste. Gemini AI instantly identifies types, counts items, and estimates weight with accuracy.' },
              { step: 'STEP 3', title: 'ACT', desc: 'View your verified impact report. Track your contribution over time with detailed stats on distance, area, and pollution removed.' },
            ].map((item, i) => (
              <div key={i} className="approach-card">
                <div style={{ padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#2DB550', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>{item.step}</span>
                </div>
                <div style={{ height: '180px', background: `linear-gradient(135deg, rgba(45,181,80,${0.1 + i * 0.05}), rgba(0,0,0,0.3))`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '48px', fontWeight: 800, color: 'rgba(255,255,255,0.1)' }}>{item.title}</span>
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ color: 'white', fontSize: '22px', fontWeight: 700, margin: '0 0 8px' }}>{item.title}</h3>
                  <p style={{ color: '#999', fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== STATS SECTION ===== */}
      <div id="stats" style={{ background: '#0a0a0a', padding: '60px 24px', borderTop: '1px solid #222', borderBottom: '1px solid #222' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
          {[
            { number: '100+', label: 'CLEANUP MISSIONS', sub: 'Active worldwide' },
            { number: 'AI', label: 'GEMINI POWERED', sub: 'Instant verification' },
            { number: '97%', label: 'ACCURACY', sub: 'Waste identification' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <p className="stat-number">{s.number}</p>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '14px', letterSpacing: '1px', margin: '8px 0 4px' }}>{s.label}</p>
              <p style={{ color: '#666', fontSize: '13px' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== MISSION SECTION (Light) ===== */}
      <div id="mission" className="quote-section">
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#1a2a22',
            letterSpacing: '-1px',
            margin: '0 0 24px',
          }}>
            "ECOLOOP'S <span style={{ color: '#2DB550', textDecoration: 'underline', textDecorationColor: '#2DB550', textUnderlineOffset: '6px' }}>INNOVATIVE SOLUTIONS</span> HAVE TRANSFORMED OUR APPROACH TO CLIMATE RESILIENCE, MAKING A{' '}
            <span style={{ color: '#2DB550', textDecoration: 'underline', textDecorationColor: '#2DB550', textUnderlineOffset: '6px' }}>TANGIBLE IMPACT</span> IN OUR COMMUNITY."
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '21px', background: '#2DB550', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '18px' }}>
              E
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 700, fontSize: '15px', margin: 0, color: '#1a2a22' }}>Ecoloop Team</p>
              <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Climate Change-Makers 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{ background: '#0a0a0a', padding: '48px 24px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 'clamp(48px, 8vw, 120px)', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-3px', margin: '0 0 24px', lineHeight: 1, WebkitTextStroke: '1px #333' }}>
          ecoloop
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span style={{ color: '#666', fontSize: '13px' }}>© 2026 Ecoloop</span>
          <span style={{ color: '#666', fontSize: '13px' }}>One4Earth Hackathon</span>
          <span style={{ color: '#666', fontSize: '13px' }}>Climate Change-Makers</span>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="hover-lift"
          style={{
            background: '#2DB550',
            color: 'white',
            padding: '14px 32px',
            borderRadius: '14px',
            fontSize: '15px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Start Making Impact →
        </button>
      </div>
    </div>
  );
};
