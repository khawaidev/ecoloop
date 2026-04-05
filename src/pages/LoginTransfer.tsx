import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const LoginTransfer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Logging you in...');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setStatus('Invalid link. No transfer code found.');
      return;
    }

    const doTransfer = async () => {
      try {
        // Fetch tokens from the session_transfers table
        const { data, error } = await supabase
          .from('session_transfers')
          .select('access_token, refresh_token')
          .eq('code', code)
          .single();

        if (error || !data) {
          setStatus('This login link has expired or is invalid. Please scan a new QR code.');
          return;
        }

        // Set the session using the fetched tokens
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

        if (sessionError) {
          setStatus('Session expired. Please scan a new QR code from your PC.');
          return;
        }

        // Delete the used transfer code
        await supabase.from('session_transfers').delete().eq('code', code);

        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      } catch {
        setStatus('Something went wrong. Please try again.');
      }
    };

    doTransfer();
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      justifyContent: 'center', alignItems: 'center',
      background: 'var(--bg-color)', padding: '24px', gap: '24px'
    }}>
      <div style={{
        width: '48px', height: '48px',
        border: '4px solid var(--border-color)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ fontWeight: 600, color: 'var(--primary)', textAlign: 'center', fontSize: '16px' }}>
        {status}
      </p>
    </div>
  );
};
