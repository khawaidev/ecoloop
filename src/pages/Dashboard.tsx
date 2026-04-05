import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Award, Recycle, ArrowRight, Smartphone } from 'lucide-react';
import QRCodeDefault from 'react-qr-code';

// Safely extract the default export for ESM/CJS interop in Vite minified builds
const QRCode = (QRCodeDefault as any).default || QRCodeDefault;

const MISSIONS_POOL = [
  { name: 'Collect 10 Plastic Items', description: 'Head out to your local park or street and pick up discarded plastic wrappers and bottles.', target: 10 },
  { name: 'Clean a 50 sqm Area', description: 'Find a visibly polluted spot near you and clean up all the plastic you can see.', target: 50 },
  { name: 'Walk 2 km collecting plastic', description: 'Focus on collecting discarded plastic bottles from your neighbourhood while walking.', target: 2 },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ totalItems: 0, totalWeight: 0, totalActivities: 0, totalDistance: 0, totalArea: 0 });
  const [mission, setMission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [sessionUrl, setSessionUrl] = useState('');

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
      
    if (!profileData) {
      navigate('/onboarding', { replace: true });
      return;
    }
      
    if (profileData) {
      setProfile(profileData);
    }

    // Fetch session tokens for QR auto-login
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (currentSession) {
      setSessionUrl(`${window.location.origin}/#access_token=${currentSession.access_token}&refresh_token=${currentSession.refresh_token}&type=recovery`);
    }

    const { data: activities } = await supabase
      .from('activities')
      .select('plastic_count, weight_kg, distance_km, area_covered_sqm')
      .eq('user_id', user.id);

    if (activities && activities.length > 0) {
      const totalItems = activities.reduce((sum: number, a: any) => sum + (a.plastic_count || 0), 0);
      const totalWeight = activities.reduce((sum: number, a: any) => sum + (a.weight_kg || 0), 0);
      const totalDistance = activities.reduce((sum: number, a: any) => sum + (a.distance_km || 0), 0);
      const totalArea = activities.reduce((sum: number, a: any) => sum + (a.area_covered_sqm || 0), 0);
      setStats({ 
        totalItems, 
        totalWeight: parseFloat(totalWeight.toFixed(2)), 
        totalActivities: activities.length,
        totalDistance: parseFloat(totalDistance.toFixed(2)),
        totalArea: parseFloat(totalArea.toFixed(1))
      });
    }

    const { data: missionData } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (missionData) {
      setMission(missionData);
    } else {
      const randomMission = MISSIONS_POOL[Math.floor(Math.random() * MISSIONS_POOL.length)];
      const { data: newMission } = await supabase
        .from('missions')
        .insert({
          user_id: user.id,
          mission_name: randomMission.name,
          mission_description: randomMission.description,
          target_count: randomMission.target,
          current_count: 0,
          status: 'active',
        })
        .select()
        .single();
      setMission(newMission);
    }

    setLoading(false);
  };

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = profile?.username || user?.user_metadata?.full_name || 'Eco Warrior';

  if (loading) {
    return (
      <div style={{ padding: '24px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header Profile Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              style={{ width: '48px', height: '48px', borderRadius: '24px', objectFit: 'cover', background: 'var(--border-color)' }}
            />
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
              {(user?.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Welcome back!</p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>{displayName}</p>
          </div>
        </div>
        <Award size={28} color="var(--primary)" />
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: '32px' }}>
        {/* Left Column (or top on mobile) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* ===== START MISSION CTA ===== */}
          <div style={{
            background: 'var(--primary)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative circle */}
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ position: 'absolute', bottom: '-10px', right: '40px', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 16px' }}>Start a Mission</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>1</div>
                  <span style={{ fontSize: '15px', opacity: 0.9 }}>Collect plastics around you</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>2</div>
                  <span style={{ fontSize: '15px', opacity: 0.9 }}>Scan & verify with AI</span>
                </div>
              </div>

              {isDesktop ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'white', padding: '16px', borderRadius: '16px', color: 'var(--text-main)' }}>
                  <div style={{ background: 'white', padding: '8px', borderRadius: '12px' }}>
                    <QRCode value={sessionUrl || `${window.location.origin}/auth`} size={100} level="L" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Smartphone size={18} color="var(--primary)" /> Scan to Start</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                      Scan this QR code with your phone to take your mission on the go!
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/mission')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
                    background: 'white',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Recycle size={20} /> Start Now <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (or bottom on mobile) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Impact Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Items Collected</span>
              <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--primary)' }}>{stats.totalItems}</span>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Weight (kg)</span>
              <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--primary)' }}>{stats.totalWeight}</span>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Distance (km)</span>
              <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--primary)' }}>{stats.totalDistance}</span>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Area (m&sup2;)</span>
              <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--primary)' }}>{stats.totalArea}</span>
            </div>
          </div>

          {/* Active Mission Card */}
          {mission && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Active Mission</h2>
              <div style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-card)',
                overflow: 'hidden',
              }}>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {mission.status === 'completed' ? '✅ Completed' : 'Daily Challenge'}
                  </span>
                  <h3 style={{ fontSize: '20px', margin: 0 }}>{mission.mission_name}</h3>

                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      <span>Progress</span>
                      <span>{mission.current_count}/{mission.target_count}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--border-color)' }}>
                      <div style={{
                        width: `${Math.min((mission.current_count / mission.target_count) * 100, 100)}%`,
                        height: '100%',
                        borderRadius: '4px',
                        background: 'var(--primary)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
