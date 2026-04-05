import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, User } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { CameraView } from './pages/CameraView';
import { Mission } from './pages/Mission';
import { Results } from './pages/Results';

// Mobile Layout Component Wrapper
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="mobile-container">
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '90px', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        maxWidth: '760px',
        margin: '0 auto',
        background: 'var(--primary)',
        borderRadius: '24px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '16px 12px',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 10
      }}>
        <Link to="/dashboard" style={{ background: location.pathname === '/dashboard' ? 'white' : 'transparent', color: location.pathname === '/dashboard' ? 'var(--primary)' : 'white', borderRadius: '16px', padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center', textDecoration: 'none' }}>
          <LayoutDashboard size={20} />
          {location.pathname === '/dashboard' && <span style={{ fontSize: '13px', fontWeight: 600 }}>Home</span>}
        </Link>
        <Link to="#" style={{ color: 'white', textDecoration: 'none', display: 'flex' }}>
          <MapIcon size={24} />
        </Link>
        <Link to="/profile" style={{ color: 'white', textDecoration: 'none', display: 'flex' }}>
          <User size={24} />
        </Link>
      </nav>
    </div>
  );
};

// Protected Route - requires session, shows bottom nav
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  if (!session) return <Navigate to="/auth" replace />;
  return <AppLayout>{children}</AppLayout>;
};

// Auth-Required Route - requires session, NO bottom nav (for onboarding/camera)
const AuthOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  if (!session) return <Navigate to="/auth" replace />;
  return <BasicLayout>{children}</BasicLayout>;
};

// Global Guard - handles OAuth redirect spinner + auto-redirect to onboarding
const RootGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const hasOAuthHash = location.hash.includes('access_token');

  // Once loading finishes AND user is authenticated AND they're on a public page → send to onboarding
  React.useEffect(() => {
    if (!isLoading && session && (hasOAuthHash || location.pathname === '/' || location.pathname === '/auth')) {
      navigate('/onboarding', { replace: true });
    }
  }, [isLoading, session, hasOAuthHash, location.pathname, navigate]);

  // Show spinner while Supabase is processing or OAuth hash is present
  if (isLoading || hasOAuthHash) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: '24px', fontWeight: 600, color: 'var(--primary)' }}>Authenticating...</p>
      </div>
    );
  }

  return <>{children}</>;
};

// Unprotected Layout (For Landing and Auth screens - no bottom nav)
const BasicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="mobile-container">
    {children}
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RootGuard>
          <Routes>
            {/* Public Flows */}
            <Route path="/" element={<BasicLayout><Landing /></BasicLayout>} />
            <Route path="/auth" element={<BasicLayout><Auth /></BasicLayout>} />

            {/* Onboarding Flow (Needs Auth but no bottom nav bar) */}
            <Route path="/onboarding" element={<AuthOnlyRoute><Onboarding /></AuthOnlyRoute>} />

            {/* Protected Flows (AppLayout containing bottom nav) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Full-screen flows without bottom nav */}
            <Route path="/camera" element={<AuthOnlyRoute><CameraView /></AuthOnlyRoute>} />
            <Route path="/mission" element={<AuthOnlyRoute><Mission /></AuthOnlyRoute>} />
            <Route path="/results" element={<AuthOnlyRoute><Results /></AuthOnlyRoute>} />
          </Routes>
        </RootGuard>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
