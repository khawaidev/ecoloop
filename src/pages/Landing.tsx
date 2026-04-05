import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/3444156-removebg-preview.png';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      background: 'var(--bg-color)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>
        {`
          .corner-ribbon {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(90deg, #2b4d37, var(--primary), #2b4d37);
            color: white;
            padding: 12px 0;
            font-weight: 800;
            font-size: 14px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            z-index: 100;
            box-shadow: 0 4px 15px rgba(0,0,0,0.25);
            overflow: hidden;
            white-space: nowrap;
            display: flex;
          }
          
          @media (min-width: 768px) {
            .corner-ribbon {
              top: 50px;
              left: -120px;
              width: 500px;
              padding: 16px 0;
              font-size: 16px;
              transform: rotate(-45deg);
              box-shadow: 0 8px 30px rgba(0,0,0,0.3);
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
        `}
      </style>

      {/* Tilted Corner Ribbon */}
      <div className="corner-ribbon">
        <div className="corner-ribbon-content">
          HACKATHON The Climate Change-Makers Challenge: 2026 BY One4Earth &nbsp;&nbsp;&nbsp; HACKATHON The Climate Change-Makers Challenge: 2026 BY One4Earth
        </div>
      </div>
      {/* Container to restrict max width but center everything nicely */ }
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '90vh',
          padding: '100px 24px 60px', // Increased top padding heavily to clear mobile ribbon
          position: 'relative',
        }}>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', zIndex: 10, marginBottom: '40px' }}>
            <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.5px' }}>ecoloop</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
            {/* Center Image Placeholder */}
            <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
              <img
                src={heroImg}
                alt="Plastic Cleanup"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  objectFit: 'cover',
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))',
                  borderRadius: 'var(--radius-xl)'
                }}
              />
            </div>

            {/* Bottom/Right Content */}
            <div style={{ flex: '1 1 300px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h1 style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-1px' }}>
                  Verified <span style={{ color: 'var(--primary)' }}>Climate</span> Action using <span style={{ color: 'var(--primary)' }}>AI</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '420px', margin: '0 auto', lineHeight: 1.6 }}>
                  Stop scrolling and start acting. Track your plastic cleanup, verify your impact instantly with Gemini AI, and find local disposal zones.
                </p>
              </div>

              <button
                onClick={() => navigate('/auth')}
                className="btn-primary hover-lift"
                style={{ width: '100%', padding: '20px', borderRadius: '24px', alignSelf: 'center', maxWidth: '300px', fontSize: '18px' }}
              >
                Get Started
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid white', borderRadius: '50%', padding: '2px' }}>
                  <ArrowRight size={20} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Information Section */}
        <div style={{ padding: '60px 24px', background: 'white', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', boxShadow: '0 -10px 40px rgba(0,0,0,0.02)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', color: 'var(--text-main)', marginBottom: '16px' }}>Our Mission</h2>
            <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>
              Ecoloop bridges the gap between environmental good intentions and verifiable action. By turning everyday litter collection into a measurable, AI-verified mission, we empower individuals to take immediate action.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
             <div style={{ padding: '32px', background: 'var(--bg-color)', borderRadius: '24px', textAlign: 'center' }}>
               <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>1. Snap & Go</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Head outside, locate discarded plastics, and capture them through our high-speed camera view.</p>
             </div>
             <div style={{ padding: '32px', background: 'var(--bg-color)', borderRadius: '24px', textAlign: 'center' }}>
               <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>2. AI Verification</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Our Gemini-powered system traces, catalogues, and estimates the exact materials you're removing from the environment.</p>
             </div>
             <div style={{ padding: '32px', background: 'var(--bg-color)', borderRadius: '24px', textAlign: 'center' }}>
               <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>3. Real Impact</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Watch your stats grow as you reduce local pollution. Level up your profile and earn achievements.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
