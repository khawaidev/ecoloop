import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { signOut } from '../lib/supabase';
import { LogOut, MapPin, ChevronRight, Award } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ totalItems: 0, totalWeight: 0, missionsCompleted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profileData) {
      setProfile(profileData);
    }

    const { data: activities } = await supabase
      .from('activities')
      .select('plastic_count, weight_kg')
      .eq('user_id', user.id);

    const { data: completedMissions } = await supabase
      .from('missions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'completed');

    if (activities && activities.length > 0) {
      const totalItems = activities.reduce((sum: number, a: any) => sum + (a.plastic_count || 0), 0);
      const totalWeight = activities.reduce((sum: number, a: any) => sum + (a.weight_kg || 0), 0);
      setStats({
        totalItems,
        totalWeight: parseFloat(totalWeight.toFixed(2)),
        missionsCompleted: completedMissions?.length || 0
      });
    } else {
      setStats({ totalItems: 0, totalWeight: 0, missionsCompleted: completedMissions?.length || 0 });
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = profile?.username || user?.user_metadata?.full_name || 'Eco Warrior';
  const email = user?.email || '';

  if (loading) {
    return (
      <div style={{ padding: '24px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Profile Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', paddingTop: '16px' }}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{ width: '80px', height: '80px', borderRadius: '40px', objectFit: 'cover', border: '3px solid var(--primary)', background: 'var(--border-color)' }}
          />
        ) : (
          <div style={{ width: '80px', height: '80px', borderRadius: '40px', border: '3px solid var(--primary)', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
            {(user?.email || 'U').charAt(0).toUpperCase()}
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>{displayName}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>{email}</p>
        </div>
        {profile?.location_name && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--primary)' }}>
            <MapPin size={14} />
            <span>{profile.location_name}</span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{stats.totalItems}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Items</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{stats.totalWeight}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Kg</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{stats.missionsCompleted}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Missions</p>
        </div>
      </div>

      {/* Badges / Achievement */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'rgba(69,123,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Award size={24} color="var(--primary)" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 2px' }}>
            {stats.totalItems >= 50 ? 'Eco Champion 🏆' : stats.totalItems >= 10 ? 'Rising Star ⭐' : 'Getting Started 🌱'}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            {stats.totalItems >= 50 ? 'You\'re making a huge impact!' : stats.totalItems >= 10 ? 'Keep up the great work!' : 'Complete missions to earn badges!'}
          </p>
        </div>
        <ChevronRight size={20} color="var(--text-muted)" />
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="hover-lift"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '18px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #ef4444',
          color: '#ef4444',
          fontWeight: 600,
          fontSize: '15px',
          background: 'transparent',
          cursor: 'pointer'
        }}
      >
        <LogOut size={20} />
        Sign Out
      </button>
    </div>
  );
};
