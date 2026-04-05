import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/3444156-removebg-preview.png';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '100vh',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
      background: 'transparent'
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative', zIndex: 10 }}>
        <span style={{ fontSize: '30px', fontWeight: 700, color: 'var(--primary)' }}>ecoloop</span>
      </div>

      {/* Center Image Placeholder */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={heroImg}
          alt="Plastic Cleanup"
          style={{
            width: '100%',
            maxWidth: '300px',
            objectFit: 'cover',
            height: '300px',
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))',
            borderRadius: 'var(--radius-xl)'
          }}
        />
      </div>

      {/* Bottom Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 600, lineHeight: 1.2, margin: '0 0 12px' }}>
            Verified <span style={{ color: 'var(--primary)' }}>Climate</span> Action using <span style={{ color: 'var(--primary)' }}>AI</span><br />
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '280px', margin: '0 auto', lineHeight: 1.6 }}>
            Use your camera to scan plastic waste, verify your impact, and find local disposal zones.
          </p>
        </div>

        <button
          onClick={() => navigate('/auth')}
          className="btn-primary hover-lift"
          style={{ width: '100%', padding: '20px', borderRadius: '24px', alignSelf: 'center', maxWidth: '300px' }}
        >
          Get Started
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid white', borderRadius: '50%', padding: '2px' }}>
            <ArrowRight size={16} />
          </div>
        </button>
      </div>
    </div>
  );
};
