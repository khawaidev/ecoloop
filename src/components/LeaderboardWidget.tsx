import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy } from 'lucide-react';

export const LeaderboardWidget = ({ currentUserId }: { currentUserId?: string }) => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    // Fetch activities and profiles
    const { data: activities } = await supabase.from('activities').select('user_id, plastic_count, distance_km, area_covered_sqm');
    const { data: profiles } = await supabase.from('profiles').select('id, username, avatar_url');
    
    if (activities && profiles) {
      const userStats = {} as Record<string, any>;
      activities.forEach(a => {
        if (!userStats[a.user_id]) userStats[a.user_id] = { items: 0, dist: 0, area: 0 };
        userStats[a.user_id].items += (a.plastic_count || 0);
        userStats[a.user_id].dist += (a.distance_km || 0);
        userStats[a.user_id].area += (a.area_covered_sqm || 0);
      });
      
      const ranked = Object.keys(userStats).map(userId => {
        const p = profiles.find(pr => pr.id === userId);
        return {
          userId,
          name: p?.username || 'Eco Warrior',
          avatar: p?.avatar_url,
          ...userStats[userId]
        };
      }).sort((a, b) => b.items - a.items).slice(0, 5); // top 5
      
      setLeaders(ranked);
    }
    setLoading(false);
  };

  if (loading) return <div style={{ padding: '16px', color: 'var(--text-muted)' }}>Loading ranks...</div>;

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Trophy size={20} color="#eab308" />
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Top Cleaners</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {leaders.length === 0 ? (
          <div style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>No records yet. Be the first!</div>
        ) : leaders.map((l, idx) => (
          <div key={l.userId} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', background: l.userId === currentUserId ? 'rgba(45,181,80,0.05)' : 'transparent', borderBottom: idx < leaders.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
            <div style={{ width: '24px', fontWeight: 700, color: idx === 0 ? '#eab308' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'var(--text-muted)' }}>#{idx + 1}</div>
            {l.avatar ? (
              <img src={l.avatar} alt={l.name} style={{ width: '32px', height: '32px', borderRadius: '16px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                {l.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {l.name} {l.userId === currentUserId && <span style={{ fontSize: '11px', color: 'var(--primary)' }}>(You)</span>}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l.dist.toFixed(1)}km • {l.area.toFixed(1)}m² covered</div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '16px' }}>{l.items}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
