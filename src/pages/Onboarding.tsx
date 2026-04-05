import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { MapPin, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

// Reverse geocode coordinates to a human-readable address
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
    );
    const data = await res.json();
    const addr = data.address || {};
    // Build a readable string: suburb/village, city/town, state
    const parts = [
      addr.suburb || addr.village || addr.neighbourhood || addr.hamlet || '',
      addr.city || addr.town || addr.county || addr.state_district || '',
      addr.state || '',
    ].filter(Boolean);
    return parts.join(', ') || data.display_name || `${lat}, ${lon}`;
  } catch {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}

export const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [locationCoords, setLocationCoords] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationVerified, setLocationVerified] = useState(false);

  // Check if profile already exists to prevent duplicate onboarding
  useEffect(() => {
    if (!user) return;
    const checkProfile = async () => {
      const { data } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
      if (data) {
        navigate('/dashboard', { replace: true });
      }
    };
    checkProfile();
  }, [user, navigate]);

  const canContinue = username.trim().length > 0 && locationVerified;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocationCoords(`${lat}, ${lon}`);

        // Reverse geocode for display
        const readable = await reverseGeocode(lat, lon);
        setLocationName(readable);
        setLocationVerified(true);
        setLocLoading(false);
      },
      (err) => {
        console.warn(err);
        alert('Could not access location. Please allow permissions.');
        setLocLoading(false);
      }
    );
  };

  const handleContinue = async () => {
    if (!canContinue) return;

    setLoading(true);

    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '';

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user?.id,
        username: username.trim(),
        location: locationCoords,
        location_name: locationName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });

    setLoading(false);

    if (error) {
      console.error(error);
    }
    // Always navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '100vh',
      maxWidth: '600px',
      margin: '0 auto',
      width: '100%',
      padding: '48px 24px 40px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '30px', fontWeight: 700, color: 'var(--primary)' }}>ecoloop</span>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '8px 0 0', lineHeight: 1.2 }}>
          Almost there!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.5 }}>
          Set up your profile so we can personalize your cleanup missions.
        </p>
      </div>

      {/* Form Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '40px', flex: 1 }}>

        {/* Username Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
            Choose a username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. EcoWarrior42"
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${username.trim() ? 'var(--primary)' : 'var(--border-color)'}`,
              background: 'var(--bg-card)',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s ease',
              color: 'var(--text-main)'
            }}
          />
          {username.trim() && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} color="var(--primary)" />
              <span style={{ fontSize: '12px', color: 'var(--primary)' }}>Looks good!</span>
            </div>
          )}
        </div>

        {/* Location Verification Block */}
        <div style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          border: `2px solid ${locationVerified ? 'var(--primary)' : 'var(--border-color)'}`,
          background: 'var(--bg-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transition: 'border-color 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Verify your location</h3>
            {locationVerified && <CheckCircle size={20} color="var(--primary)" />}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            We need your location to find nearby cleanup zones and recycling centers.
          </p>

          {!locationVerified ? (
            <button
              onClick={handleGetLocation}
              disabled={locLoading}
              className="btn-outline hover-lift"
              style={{ padding: '14px', fontSize: '14px', borderRadius: 'var(--radius-lg)' }}
            >
              {locLoading ? (
                <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Detecting location...</>
              ) : (
                <><MapPin size={18} /> Allow Location Access</>
              )}
            </button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(69, 123, 89, 0.1)'
            }}>
              <MapPin size={16} color="var(--primary)" />
              <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 500 }}>
                {locationName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!canContinue || loading}
        className="hover-lift"
        style={{
          width: '100%',
          padding: '20px',
          borderRadius: '24px',
          background: canContinue ? 'var(--primary)' : 'var(--border-color)',
          color: canContinue ? 'white' : 'var(--text-muted)',
          fontSize: '16px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          cursor: canContinue ? 'pointer' : 'not-allowed',
          transition: 'all 0.25s ease',
          marginTop: '32px'
        }}
      >
        {loading ? 'Saving...' : 'Continue to Dashboard'}
        <ArrowRight size={20} />
      </button>
    </div>
  );
};
