import React, { useState } from 'react';
import Modal from '@/components/modals/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/supabase';
import GoogleIcon from '@/components/shared/GoogleIcon';
import { UserPlus } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSuccess('Account created! Check your email to confirm your account.');
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  const handleGoogleSignUp = async () => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Create Account" maxWidth="max-w-sm">
      <div className="flex flex-col gap-4">
        {error && (
          <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-xs text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
            {success}
          </p>
        )}

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
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
            <label className="text-xs font-bold font-mono uppercase tracking-wide text-text-muted">Full Name</label>
            <Input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
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
              placeholder="Min 6 characters"
              minLength={6}
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full mt-1" disabled={loading || googleLoading}>
            <UserPlus size={16} className="mr-2" />
            {loading ? 'Creating account…' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-accent font-bold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default SignUpModal;
