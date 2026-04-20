import React, { useState } from 'react';
import Modal from '@/components/modals/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/supabase';
import GoogleIcon from '@/components/shared/GoogleIcon';
import { LogIn } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setEmail('');
      setPassword('');
      onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    setGoogleLoading(false);
    if (authError) {
      setError(authError.message);
    }
    // On success Supabase redirects the browser — modal will close naturally
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign In" maxWidth="max-w-sm">
      <div className="flex flex-col gap-4">
        {error && (
          <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 h-12 px-4 rounded-lg bg-background shadow-card border border-border-dark/30 text-sm font-medium text-text-primary hover:shadow-floating hover:brightness-105 active:shadow-pressed transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoogleIcon />
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border-dark/30" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-text-muted">or</span>
          <div className="flex-1 h-px bg-border-dark/30" />
        </div>

        {/* Email / password */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold font-mono uppercase tracking-wide text-text-muted">Email</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold font-mono uppercase tracking-wide text-text-muted">Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full mt-1" disabled={loading || googleLoading}>
            <LogIn size={16} className="mr-2" />
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted">
          No account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-accent font-bold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default LoginModal;
