import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { GoogleIcon, ArrowRightIcon, UserIcon, CheckCircleIcon } from './Icons';
import {
  signInWithGoogle,
  loginWithEmail,
  registerWithEmail,
} from '../firebase';

interface AuthViewProps {
  onSuccess: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (mode === 'register' && !username.trim()) {
      setErrorMsg('Please choose an architectural username / handle.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    try {
      setIsLoading(true);
      let user: User;
      if (mode === 'register') {
        user = await registerWithEmail(email, password, username);
      } else {
        user = await loginWithEmail(email, password);
      }
      onSuccess(user);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error('Authentication error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid email or password. Please verify credentials.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Try signing in.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMsg('Password is too weak. Please use a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg('Please enter a valid email address.');
      } else {
        setErrorMsg(error.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    try {
      setIsLoading(true);
      const user = await signInWithGoogle();
      onSuccess(user);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (
        error.code !== 'auth/popup-closed-by-user' &&
        error.code !== 'auth/cancelled-popup-request'
      ) {
        setErrorMsg(error.message || 'Failed to authenticate with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top Metallic Accents */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent opacity-30" />

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#181818] border border-[#2E2E2E] mb-2 shadow-inner">
            <span className="w-3.5 h-3.5 bg-[#F5F5F5] rotate-45 inline-block" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Platform Steady
          </h2>
          <p className="text-xs font-mono text-[#888888] uppercase tracking-wider">
            Authentication Required · System Gateway
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Register */}
        <div className="flex border border-[#242424] rounded-lg p-1 bg-[#0A0A0A] mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-medium rounded transition-all duration-150 ${
              mode === 'signin'
                ? 'bg-[#222222] text-[#F5F5F5] font-semibold shadow-sm'
                : 'text-[#888888] hover:text-[#C0C0C0]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-medium rounded transition-all duration-150 ${
              mode === 'register'
                ? 'bg-[#222222] text-[#F5F5F5] font-semibold shadow-sm'
                : 'text-[#888888] hover:text-[#C0C0C0]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/30 border border-red-800/50 text-red-300 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-mono text-[#A0A0A0] uppercase mb-1.5 tracking-wider">
                Username / Call-Sign
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. sys_architect"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E0E0E] border border-[#2A2A2A] text-sm text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:border-[#C0C0C0] transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-[#A0A0A0] uppercase mb-1.5 tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E0E0E] border border-[#2A2A2A] text-sm text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:border-[#C0C0C0] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#A0A0A0] uppercase mb-1.5 tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E0E0E] border border-[#2A2A2A] text-sm text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:border-[#C0C0C0] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-lg bg-[#F5F5F5] hover:bg-[#C0C0C0] text-[#080808] font-semibold text-xs tracking-wider uppercase transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <span>{isLoading ? 'Processing...' : mode === 'signin' ? 'Sign In to Workspace' : 'Register Profile'}</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#222222]" />
          </div>
          <span className="relative bg-[#121212] px-3 text-[10px] font-mono text-[#666666] uppercase">
            Or Authenticate Via
          </span>
        </div>

        {/* Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-lg bg-[#181818] hover:bg-[#202020] border border-[#2A2A2A] text-xs font-medium text-[#F5F5F5] transition-all duration-150 flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <GoogleIcon className="w-4 h-4 text-[#F5F5F5]" />
          <span>Continue with Google</span>
        </button>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-[#1E1E1E] text-center">
          <p className="text-[11px] text-[#777777] leading-relaxed">
            Progress is automatically saved to your user profile and synced across devices with offline persistence.
          </p>
        </div>

      </div>
    </div>
  );
};
