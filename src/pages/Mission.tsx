import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { analyzeWithGemini } from '../lib/gemini';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import { Play, Pause, CheckCircle, Camera, Loader2, MapPin, RotateCcw, Shield } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Recenter + zoom closer on each position update
function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 19, { animate: true }); // zoom 19 = very close street level
    }
  }, [position, map]);
  return null;
}

// ---- Background persistence helpers ----
const MISSION_STORAGE_KEY = 'ecoloop_active_mission';

function saveMissionState(state: { startedAt: number; elapsed: number; phase: string; positions: [number, number][]; distance: number }) {
  localStorage.setItem(MISSION_STORAGE_KEY, JSON.stringify(state));
}

function loadMissionState(): { startedAt: number; elapsed: number; phase: string; positions: [number, number][]; distance: number } | null {
  try {
    const raw = localStorage.getItem(MISSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearMissionState() {
  localStorage.removeItem(MISSION_STORAGE_KEY);
}

// Request notification permission + show a persistent notification
async function showMissionNotification() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }
  if (Notification.permission === 'granted') {
    new Notification('ecoloop Mission Active 🌍', {
      body: 'Your cleanup mission is running. Come back to the app to pause or finish.',
      icon: '/vite.svg',
      tag: 'ecoloop-mission', // replaces existing notification
      requireInteraction: true
    });
  }
}

type Phase = 'permission' | 'running' | 'paused' | 'stopped' | 'scanning' | 'analyzing';

export const Mission = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [phase, setPhase] = useState<Phase>('permission');
  const [seconds, setSeconds] = useState(0);
  const [positions, setPositions] = useState<[number, number][]>([]);
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(Date.now());

  // ---- RESTORE FROM BACKGROUND ----
  useEffect(() => {
    const saved = loadMissionState();
    if (saved && saved.phase === 'running') {
      // Calculate elapsed time while user was away
      const awaySeconds = Math.floor((Date.now() - saved.startedAt) / 1000);
      setSeconds(awaySeconds);
      setPositions(saved.positions || []);
      setTotalDistance(saved.distance || 0);
      startedAtRef.current = saved.startedAt;
      // Skip permission popup, resume directly
      if (saved.positions.length > 0) {
        setCurrentPos(saved.positions[saved.positions.length - 1]);
        setHasLocationPermission(true);
      }
      setPhase('running');
    }
  }, []);

  // ---- SAVE STATE ON UNLOAD (background persistence) ----
  useEffect(() => {
    const handleUnload = () => {
      if (phase === 'running' || phase === 'paused') {
        saveMissionState({
          startedAt: startedAtRef.current,
          elapsed: seconds,
          phase: 'running', // always save as running so it resumes
          positions,
          distance: totalDistance,
        });
        showMissionNotification();
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && (phase === 'running' || phase === 'paused')) {
        saveMissionState({ startedAt: startedAtRef.current, elapsed: seconds, phase: 'running', positions, distance: totalDistance });
        showMissionNotification();
      }
    });

    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [phase, seconds, positions, totalDistance]);

  // ---- PERMISSION POPUP ----
  const handlePermissionAccept = () => {
    // Also request notification permission early
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    startedAtRef.current = Date.now();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setCurrentPos(p);
        setPositions([p]);
        setHasLocationPermission(true);
        setPhase('running');
      },
      () => {
        setHasLocationPermission(false);
        setPhase('running');
      },
      { enableHighAccuracy: true }
    );
  };

  // ---- ANDROID NAV BAR TRANSPARENCY ----
  useEffect(() => {
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTheme);
    }
    const originalContent = metaTheme.getAttribute('content');
    
    if (phase === 'scanning' || phase === 'analyzing') {
      metaTheme.setAttribute('content', '#000000');
    } else {
      metaTheme.setAttribute('content', '#f7faf8'); // default bg-color
    }

    return () => {
      if (originalContent) metaTheme?.setAttribute('content', originalContent);
    };
  }, [phase]);

  // ---- TIMER ----
  useEffect(() => {
    if (phase === 'running') {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // ---- GEO TRACKING ----
  useEffect(() => {
    if (phase === 'running' && hasLocationPermission && !watchIdRef.current) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setCurrentPos(newPos);
          setPositions((prev) => {
            if (prev.length > 0) {
              const last = prev[prev.length - 1];
              const dist = haversine(last[0], last[1], newPos[0], newPos[1]);
              // Changed threshold to 0.001 (1 meter) for much higher tracking fidelity
              if (dist > 0.001) {
                setTotalDistance((d) => d + dist);
                return [...prev, newPos];
              }
            }
            return prev.length === 0 ? [newPos] : prev;
          });
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      );
    }
    if (phase === 'stopped' || phase === 'scanning') {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }
    return () => { if (watchIdRef.current) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; } };
  }, [phase, hasLocationPermission]);

  // ---- CAMERA ----
  const openCamera = useCallback(async () => {
    setPhase('scanning');
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
    } catch {
      alert('Could not access camera.');
      setPhase('stopped');
    }
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(dataUrl);
    const stream = video.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());
    video.srcObject = null;
  };

  // ---- AI ANALYSIS ----
  const analyzePhoto = async () => {
    if (!capturedImage || analyzing) return;
    setAnalyzing(true);
    setAnalysisError('');

    try {
      const base64 = capturedImage.split(',')[1];
      const result = await analyzeWithGemini(base64, seconds);

      // Save activity to Supabase
      await supabase.from('activities').insert({
        user_id: user.id,
        plastic_types: result.types,
        plastic_count: result.count,
        weight_kg: result.weight_kg,
        impact_text: result.impact,
        time_spent_seconds: seconds,
        distance_km: parseFloat(totalDistance.toFixed(3)),
        area_covered_sqm: parseFloat((totalDistance * 10).toFixed(1)),
      });

      // Update mission
      const { data: activeMission } = await supabase
        .from('missions').select('*')
        .eq('user_id', user.id).eq('status', 'active')
        .order('created_at', { ascending: false }).limit(1).single();

      if (activeMission) {
        let increment = result.count;
        const mName = activeMission.mission_name.toLowerCase();
        if (mName.includes('area') || mName.includes('sqm')) {
          increment = parseFloat((totalDistance * 10).toFixed(1));
        } else if (mName.includes('km') || mName.includes('walk')) {
          increment = parseFloat(totalDistance.toFixed(3));
        }

        const newCount = activeMission.current_count + increment;
        const done = newCount >= activeMission.target_count;
        await supabase.from('missions').update({
          current_count: newCount,
          status: done ? 'completed' : 'active',
          time_spent_seconds: (activeMission.time_spent_seconds || 0) + seconds,
          distance_km: (activeMission.distance_km || 0) + parseFloat(totalDistance.toFixed(3)),
          completed_at: done ? new Date().toISOString() : null,
        }).eq('id', activeMission.id);
      }

      // Clear background state
      clearMissionState();

      // Navigate to results
      navigate('/results', {
        state: {
          analysis: result,
          timeSpent: seconds,
          distance: totalDistance,
          hasLocation: hasLocationPermission,
        }
      });
    } catch (err: any) {
      setAnalysisError(err.message || 'Analysis failed. Try again.');
      setAnalyzing(false);
    }
  };

  // =========== RENDER PHASES ===========

  // PERMISSION POPUP
  if (phase === 'permission') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', padding: '32px', background: 'var(--bg-color)' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '32px 24px', maxWidth: '380px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '32px', background: 'rgba(69,123,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <Shield size={32} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Location Permission</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            This app needs your location to track areas you've cleaned, distance covered, and show your real-time movement on the map during the mission.
          </p>
          <button onClick={handlePermissionAccept} className="btn-primary hover-lift" style={{ width: '100%', borderRadius: '16px', padding: '18px' }}>
            I Understand, Continue
          </button>
          <button onClick={() => navigate(-1)} style={{ fontSize: '14px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // SCANNING PHASE
  if (phase === 'scanning') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000', color: 'white', position: 'relative' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ flex: 1, objectFit: 'cover', display: capturedImage ? 'none' : 'block' }} />
        {capturedImage && <img src={capturedImage} alt="Captured" style={{ flex: 1, objectFit: 'contain', background: '#111' }} />}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div style={{ padding: '24px', display: 'flex', gap: '12px' }}>
          {!capturedImage ? (
            <button onClick={capturePhoto} className="btn-primary" style={{ flex: 1, borderRadius: '16px' }}>
              <Camera size={20} /> Capture Photo
            </button>
          ) : (
            <>
              <button onClick={() => { setCapturedImage(null); openCamera(); }} style={{
                width: '52px', height: '52px', borderRadius: '26px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0
              }}>
                <RotateCcw size={22} color="white" />
              </button>
              <button onClick={analyzePhoto} disabled={analyzing} className="btn-primary" style={{ flex: 1, borderRadius: '16px' }}>
                {analyzing ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : 'Analyze with AI'}
              </button>
            </>
          )}
        </div>
        {analysisError && <p style={{ padding: '0 24px 16px', color: '#ff6b6b', fontSize: '13px', textAlign: 'center' }}>{analysisError}</p>}
      </div>
    );
  }

  // ANALYZING
  if (phase === 'analyzing') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)', gap: '24px', padding: '24px' }}>
        <Loader2 size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <h2 style={{ margin: 0 }}>Analyzing with AI...</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Identifying plastic types and estimating impact</p>
      </div>
    );
  }

  // DEFAULT: MAP + TIMER
  const mapCenter = currentPos || [20.5937, 78.9629];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-color)' }}>

      {/* Map Section - 70% */}
      <div style={{ height: '70%', position: 'relative', flexShrink: 0 }}>
        {hasLocationPermission && currentPos ? (
          <MapContainer center={mapCenter as [number, number]} zoom={19} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
            <RecenterMap position={currentPos} />
            {positions.length > 1 && <Polyline positions={positions} color="#457B59" weight={4} opacity={0.8} />}
            <CircleMarker center={currentPos} radius={10} pathOptions={{ fillColor: '#457B59', fillOpacity: 1, color: 'white', weight: 3 }} />
          </MapContainer>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8f0ec', flexDirection: 'column', gap: '12px' }}>
            <MapPin size={40} color="var(--primary)" />
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {hasLocationPermission ? 'Acquiring GPS...' : 'Location tracking disabled'}
            </p>
          </div>
        )}

        {/* Distance & Area Overlay */}
        {hasLocationPermission && (
          <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px', zIndex: 1000 }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              📍 {(totalDistance * 1000).toFixed(0)}m
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <span style={{ marginRight: '4px' }}>🌍</span>{(totalDistance * 10).toFixed(1)} m²
            </div>
          </div>
        )}

        {/* Timer Pill Overlay on Map */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'white', borderRadius: '12px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: phase === 'running' ? '#22c55e' : phase === 'paused' ? '#eab308' : '#94a3b8' }} />
          {formatTime(seconds)}
        </div>
      </div>

      {/* Controls - bottom 30% */}
      <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>

        {/* Timer Display */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            {phase === 'running' ? 'Mission Active' : phase === 'paused' ? 'Paused' : 'Mission Ended'}
          </p>
          <p style={{ fontSize: '48px', fontWeight: 700, margin: 0, fontVariantNumeric: 'tabular-nums', color: 'var(--text-main)' }}>{formatTime(seconds)}</p>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '320px' }}>
          {phase === 'running' && (
            <button onClick={() => setPhase('paused')} className="btn-outline hover-lift" style={{ flex: 1, borderRadius: '16px', padding: '14px' }}>
              <Pause size={20} /> Pause
            </button>
          )}
          {phase === 'paused' && (
            <>
              {/* Continue - soft white with primary color */}
              <button onClick={() => setPhase('running')} className="hover-lift" style={{
                flex: 1, borderRadius: '16px', padding: '14px',
                background: '#f1f5f1', color: 'var(--primary)', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <Play size={18} /> Continue
              </button>
              {/* Done - soft green */}
              <button onClick={() => { setPhase('stopped'); clearMissionState(); }} className="hover-lift" style={{
                flex: 1, borderRadius: '16px', padding: '14px',
                background: 'rgba(69,123,89,0.15)', color: 'var(--primary)', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                border: '1px solid rgba(69,123,89,0.3)'
              }}>
                <CheckCircle size={18} /> Done
              </button>
            </>
          )}
          {phase === 'stopped' && (
            <button onClick={openCamera} className="btn-primary hover-lift" style={{ flex: 1, borderRadius: '16px', padding: '16px', fontSize: '15px' }}>
              <Camera size={22} /> Scan Plastics
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
