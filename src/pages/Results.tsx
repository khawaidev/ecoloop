import { useLocation, useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, MapPin, Clock, Scale, Recycle } from 'lucide-react';

export const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  // If no state (direct navigation), redirect to dashboard
  if (!state || !state.analysis) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', padding: '24px', background: 'var(--bg-color)' }}>
        <p style={{ color: 'var(--text-muted)' }}>No results to display.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ marginTop: '16px', borderRadius: '16px' }}>Go to Dashboard</button>
      </div>
    );
  }

  const { analysis, timeSpent, distance, hasLocation } = state;
  const minutes = Math.floor(timeSpent / 60);
  const secs = timeSpent % 60;
  const distanceMeters = (distance * 1000).toFixed(0);
  const areaSqm = (distance * 10).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', padding: '24px', gap: '20px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', paddingTop: '16px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '36px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white' }}>
          <Leaf size={36} />
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 4px' }}>Mission Complete!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>AI Verified Cleanup Report</p>
      </div>

      {/* Key Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
          <Recycle size={20} color="var(--primary)" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{analysis.count}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Items Found</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
          <Scale size={20} color="var(--primary)" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{analysis.weight_kg} kg</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Approx Weight</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
          <Clock size={20} color="var(--primary)" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{minutes}m {secs}s</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Time Spent</p>
        </div>
        {hasLocation && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
            <MapPin size={20} color="var(--primary)" style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{distanceMeters}m</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Distance Covered</p>
          </div>
        )}
      </div>

      {/* Area Cleaned (location users only) */}
      {hasLocation && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: 'rgba(69,123,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MapPin size={20} color="var(--primary)" />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>Approx Area Cleaned</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>{areaSqm} sq meters</p>
          </div>
        </div>
      )}

      {/* Plastic Types */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', margin: '0 0 10px' }}>Plastic / Trash Types Identified</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {analysis.types.map((t: string, i: number) => (
            <span key={i} style={{ background: 'rgba(69,123,89,0.1)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Environmental Impact */}
      <div style={{ background: 'var(--primary)', borderRadius: 'var(--radius-lg)', padding: '20px', color: 'white' }}>
        <h3 style={{ fontSize: '15px', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>🌍 Pollution Reduced</h3>
        <p style={{ fontSize: '14px', lineHeight: 1.6, opacity: 0.95, margin: '0 0 10px' }}>{analysis.impact}</p>
        <p style={{ fontSize: '13px', lineHeight: 1.6, opacity: 0.8, margin: 0, fontStyle: 'italic' }}>{analysis.time_context}</p>
      </div>

      {/* Back to Dashboard */}
      <button onClick={() => navigate('/dashboard')} className="btn-primary hover-lift" style={{ width: '100%', borderRadius: '16px', marginTop: '8px' }}>
        Back to Dashboard <ArrowRight size={18} />
      </button>
    </div>
  );
};
