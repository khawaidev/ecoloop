import { ArrowRight, Leaf } from 'lucide-react';
import { signInWithGoogle } from '../lib/supabase';

export const Login = () => {
  // This will double as our Landing / Login Page for TreeSnap
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '100vh',
      minHeight: '100dvh',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative', zIndex: 10 }}>
        <Leaf size={28} color="var(--primary)" fill="var(--primary)" />
        <span style={{ fontSize: '24px', fontWeight: 600, color: 'var(--primary)' }}>TreeSnap</span>
      </div>

      {/* Center Image - Succulent Placeholder */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80" 
          alt="Green succulent pot"
          style={{
            width: '100%',
            maxWidth: '300px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))',
            borderRadius: 'var(--radius-xl)'
          }}
        />
      </div>

      {/* Bottom Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 600, lineHeight: 1.2, margin: '0 0 12px' }}>
            <span style={{ color: 'var(--primary)' }}>Green</span> plants for<br/>
            <span style={{ color: 'var(--primary)' }}>Green</span> earth
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '280px', margin: '0 auto', lineHeight: 1.6 }}>
            Green plants are essential for life on earth as they play a critical role in producing oxygen.
          </p>
        </div>

        <button 
          onClick={signInWithGoogle}
          className="btn-primary hover-lift"
          style={{ width: '100%', padding: '20px', borderRadius: '24px' }}
        >
          Get Started
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
