import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { MapPin, Clock, Recycle, Scale, ChevronDown, ChevronUp, Award } from 'lucide-react';

export const CoveredAreas = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMission, setExpandedMission] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);

    const { data: missionData } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const { data: activityData } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setMissions(missionData || []);
    setActivities(activityData || []);
    setLoading(false);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const totalDistance = activities.reduce((sum, a) => sum + (a.distance_km || 0), 0);
  const totalArea = activities.reduce((sum, a) => sum + (a.area_covered_sqm || 0), 0);
  const totalItems = activities.reduce((sum, a) => sum + (a.plastic_count || 0), 0);
  const totalWeight = activities.reduce((sum, a) => sum + (a.weight_kg || 0), 0);

  if (loading) {
    return (
      <div style={{ padding: '24px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading history...</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', background: 'var(--bg-color)' }}>
      <div style={{ padding: '24px', width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px' }}>My Impact</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Your cleanup journey overview</p>
        </div>

        {/* Aggregate Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
            <MapPin size={18} color="var(--primary)" style={{ marginBottom: '6px' }} />
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{totalDistance.toFixed(2)}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>km walked</p>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
            <Award size={18} color="var(--primary)" style={{ marginBottom: '6px' }} />
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{totalArea.toFixed(0)}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>m² cleaned</p>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
            <Recycle size={18} color="var(--primary)" style={{ marginBottom: '6px' }} />
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{totalItems}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>items collected</p>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
            <Scale size={18} color="var(--primary)" style={{ marginBottom: '6px' }} />
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{totalWeight.toFixed(2)}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>kg removed</p>
          </div>
        </div>

        {/* Missions History */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px' }}>Mission History</h2>

          {missions.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>No missions yet. Start your first mission from the dashboard!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {missions.map((m) => {
                const isExpanded = expandedMission === m.id;
                const progress = Math.min((m.current_count / m.target_count) * 100, 100);
                const isCompleted = m.status === 'completed';

                return (
                  <div
                    key={m.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: `1px solid ${isCompleted ? 'var(--primary)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    {/* Mission Header */}
                    <div
                      onClick={() => setExpandedMission(isExpanded ? null : m.id)}
                      style={{ padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                            color: isCompleted ? 'white' : 'var(--primary)',
                            background: isCompleted ? 'var(--primary)' : 'rgba(69,123,89,0.1)',
                            padding: '2px 8px', borderRadius: '6px'
                          }}>
                            {isCompleted ? '✅ Completed' : '🟡 Active'}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '4px 0 0' }}>{m.mission_name}</h3>
                      </div>
                      {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                    </div>

                    {/* Progress Bar */}
                    <div style={{ padding: '0 16px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        <span>Progress</span>
                        <span>{Math.min(m.current_count, m.target_count)}/{m.target_count}</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'var(--border-color)' }}>
                        <div style={{
                          width: `${progress}%`, height: '100%', borderRadius: '3px',
                          background: isCompleted ? 'var(--primary)' : 'linear-gradient(90deg, var(--primary), #6bc88a)',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 12px' }}>{m.mission_description}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                          <div style={{ textAlign: 'center' }}>
                            <Clock size={14} color="var(--primary)" />
                            <p style={{ fontSize: '14px', fontWeight: 600, margin: '4px 0 0' }}>{formatTime(m.time_spent_seconds || 0)}</p>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Time</p>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <MapPin size={14} color="var(--primary)" />
                            <p style={{ fontSize: '14px', fontWeight: 600, margin: '4px 0 0' }}>{((m.distance_km || 0) * 1000).toFixed(0)}m</p>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Distance</p>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <Recycle size={14} color="var(--primary)" />
                            <p style={{ fontSize: '14px', fontWeight: 600, margin: '4px 0 0' }}>{Math.min(m.current_count, m.target_count)}</p>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Collected</p>
                          </div>
                        </div>
                        {m.completed_at && (
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '12px 0 0', textAlign: 'center' }}>
                            Completed on {new Date(m.completed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px' }}>Recent Cleanups</h2>
          {activities.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>No cleanups recorded yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activities.map((a, i) => (
                <div key={a.id || i} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)', padding: '16px',
                  display: 'flex', alignItems: 'center', gap: '14px'
                }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '21px',
                    background: 'rgba(69,123,89,0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Recycle size={20} color="var(--primary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>
                      {a.plastic_count} items &middot; {a.weight_kg} kg
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                      {((a.distance_km || 0) * 1000).toFixed(0)}m covered &middot; {formatTime(a.time_spent_seconds || 0)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                      {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
