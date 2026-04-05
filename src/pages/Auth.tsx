import { useState, useEffect } from 'react';
import { signInWithGoogle } from '../lib/supabase';
import clima from "../assets/group-effort-clean-up-ocean-plastic-perfect-environmental-awareness-campaigns-educational-resources_1254878-44439.jpg";

export const Auth = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const desktopBg = "https://i.ibb.co/5WwbKRPz/man-collecting-plastic-garbage-polluted-park.jpg";
  const mobileBg = clima; // Using imported local asset for mobile

  if (isDesktop) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
        {/* Left Side: Image */}
        <div style={{ flex: 1.2, position: 'relative' }}>
          <img src={desktopBg} alt="Cleanup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, transparent, rgba(var(--bg-card-rgb), 1))' }} />
        </div>
        
        {/* Right Side: Auth Form */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', background: 'var(--bg-card)' }}>
          <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 700, margin: '0 0 16px', color: 'var(--text-main)' }}>
              Join <span style={{ color: 'var(--primary)' }}>ecoloop</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: 500, margin: '0 0 12px' }}>
              Let's clean up the world together.
            </p>
            <p style={{ color: 'var(--text-main)', fontSize: '15px', lineHeight: 1.6, opacity: 0.8, margin: '0 0 40px' }}>
              Every piece of plastic you scan and collect brings us one step closer to a cleaner, greener earth.
            </p>

            <button
              onClick={signInWithGoogle}
              className="hover-lift"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
                background: 'white', color: '#1a2a22', padding: '20px 16px', borderRadius: '30px',
                fontSize: '18px', fontWeight: 600, border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)', cursor: 'pointer', width: '100%'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100vh', position: 'relative', overflow: 'hidden'
    }}>
      <img src={mobileBg} alt="Ecoloop Background" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%', background: 'linear-gradient(to top, var(--bg-card) 25%, transparent)', zIndex: 2 }}></div>

      <div style={{ padding: '0 24px 48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', zIndex: 10, width: '100%', position: 'relative' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Join <span style={{ color: 'var(--primary)' }}>ecoloop</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: 500, margin: 0 }}>Let's clean up the world together.</p>
          <p style={{ color: 'var(--text-main)', fontSize: '13px', lineHeight: 1.5, opacity: 0.8, maxWidth: '280px', margin: '4px auto 0' }}>
            Every piece of plastic you scan and collect brings us one step closer to a cleaner, greener earth.
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '320px' }}>
          <button onClick={signInWithGoogle} className="hover-lift" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'white', color: '#1a2a22', padding: '18px 16px', borderRadius: '24px', fontSize: '16px', fontWeight: 600, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', cursor: 'pointer', width: '100%' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};
