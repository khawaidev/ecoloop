import { useState, useRef, useCallback } from 'react';
import { Camera, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* Note: In a real app we'd use navigator.mediaDevices.getUserMedia directly or a library like react-webcam. Here we implement a mock verified scanner view. */

export const CameraView = () => {
  const navigate = useNavigate();
  const [captured, setCaptured] = useState(false);

  // Mock taking a picture
  const handleCapture = () => {
    setCaptured(true);
    // Normally we'd take the Blob and pass to Gemini
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      height: '100dvh',
      background: '#000',
      color: 'white',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ color: 'white', background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
          <X size={24} />
        </button>
        <span style={{ fontWeight: 600 }}>Scan Plastic</span>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Viewfinder Area (Mock) */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         {!captured ? (
           <>
             {/* Mock camera feed background */}
             <img src="https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc9?auto=format&fit=crop&w=400&q=80" style={{ position:'absolute', width:'100%', height:'100%', objectFit: 'cover', opacity: 0.6 }} />
             {/* Viewfinder overlay */}
             <div style={{ width: '250px', height: '250px', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '24px', position: 'relative', zIndex: 10 }}>
               {/* Corner accents */}
               <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '30px', height: '30px', borderTop: '4px solid #fff', borderLeft: '4px solid #fff', borderTopLeftRadius: '24px' }}></div>
               <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '30px', height: '30px', borderTop: '4px solid #fff', borderRight: '4px solid #fff', borderTopRightRadius: '24px' }}></div>
               <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '30px', height: '30px', borderBottom: '4px solid #fff', borderLeft: '4px solid #fff', borderBottomLeftRadius: '24px' }}></div>
               <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '30px', height: '30px', borderBottom: '4px solid #fff', borderRight: '4px solid #fff', borderBottomRightRadius: '24px' }}></div>
             </div>
             <p style={{ position:'absolute', bottom: '20%', fontSize: '14px', background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '20px' }}>Point camera at collected items</p>
           </>
         ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 10 }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={40} color="white" />
              </div>
              <h2 style={{ margin: 0 }}>Captured Successfully</h2>
              <p style={{ opacity: 0.7 }}>Passing image to Gemini Vision AI...</p>
            </div>
         )}
      </div>

      {/* Controls */}
      <div style={{ padding: '40px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
        {!captured ? (
          <button 
            onClick={handleCapture}
            style={{ width: '70px', height: '70px', borderRadius: '35px', border: '4px solid white', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          >
            <div style={{ width: '54px', height: '54px', borderRadius: '27px', background: 'white' }}></div>
          </button>
        ) : (
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            Verify Analysis Dashboard
          </button>
        )}
      </div>
    </div>
  );
};
