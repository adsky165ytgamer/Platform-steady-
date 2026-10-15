import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { GoogleIcon, LogOutIcon, UserIcon, CheckCircleIcon } from './Icons';
import { signInWithGoogle, logOut } from '../firebase';

interface GoogleAuthButtonProps {
  user: User | null;
  username?: string;
  loading: boolean;
  onAuthError?: (errorMessage: string) => void;
  compact?: boolean;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  user,
  username,
  loading,
  onAuthError,
  compact = false,
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const displayNameOrUsername = username
    ? `@${username}`
    : user?.displayName || user?.email?.split('@')[0] || 'Architect';

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      // Ignore user cancelled / popup closed by user
      if (
        error.code !== 'auth/popup-closed-by-user' &&
        error.code !== 'auth/cancelled-popup-request'
      ) {
        console.error('Sign-in failed:', error);
        if (onAuthError) {
          onAuthError(error.message || 'Unable to sign in with Google. Please try again.');
        }
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setMenuOpen(false);
      await logOut();
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#2A2A2A] bg-[#121212] text-[#888888] text-xs font-mono animate-pulse">
        <span className="w-2 h-2 rounded-full bg-[#888888]" />
        <span>Authenticating...</span>
      </div>
    );
  }

  // Authenticated state
  if (user) {
    if (compact) {
      return (
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-[#2A2A2A] bg-[#121212] hover:bg-[#1A1A1A] hover:border-[#3E3E3E] text-xs text-[#F5F5F5] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C0C0C0]"
            title={user.email || 'User Account'}
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayNameOrUsername}
                className="w-5 h-5 rounded-full object-cover border border-[#3E3E3E]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-[#2A2A2A] text-[#F5F5F5] flex items-center justify-center text-[10px] font-bold">
                {displayNameOrUsername.replace('@', '').charAt(0).toUpperCase()}
              </div>
            )}
            <span className="hidden sm:inline font-mono font-medium max-w-[120px] truncate text-xs text-[#F5F5F5]">
              {displayNameOrUsername}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Cloud Synced" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 mt-2 w-64 rounded-lg bg-[#141414] border border-[#2A2A2A] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center gap-3 pb-3 border-b border-[#222222]">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={displayNameOrUsername}
                      className="w-9 h-9 rounded-full object-cover border border-[#333333]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#222222] text-[#F5F5F5] flex items-center justify-center font-bold text-sm">
                      {displayNameOrUsername.replace('@', '').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-[#F5F5F5] truncate font-mono">
                      {displayNameOrUsername}
                    </p>
                    <p className="text-[11px] font-mono text-[#888888] truncate">{user.email}</p>
                  </div>
                </div>

                <div className="py-2.5 px-1 flex items-center gap-2 text-[11px] font-mono text-[#A0A0A0]">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Cloud progress sync active</span>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full mt-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[#C0C0C0] hover:text-[#F5F5F5] hover:bg-[#202020] rounded border border-[#2A2A2A] transition-colors"
                >
                  <LogOutIcon className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      );
    }

    // Full Sidebar / Card layout
    return (
      <div className="p-3 rounded-lg border border-[#2A2A2A] bg-[#121212]">
        <div className="flex items-center gap-2.5 mb-2.5">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayNameOrUsername}
              className="w-8 h-8 rounded-full object-cover border border-[#333333]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#222222] text-[#F5F5F5] flex items-center justify-center text-xs font-bold font-mono">
              {displayNameOrUsername.replace('@', '').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-xs font-medium text-[#F5F5F5] truncate font-mono">
              {displayNameOrUsername}
            </p>
            <p className="text-[10px] font-mono text-[#888888] truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#1E1E1E]">
          <span className="text-[10px] font-mono text-[#888888] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Cloud Synced
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-[11px] font-mono text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[#1E1E1E]"
          >
            <LogOutIcon className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Unauthenticated: Sign in with Google Button
  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isSigningIn}
      className={`group flex items-center justify-center gap-2 rounded border border-[#2A2A2A] bg-[#121212] hover:bg-[#1A1A1A] hover:border-[#444444] text-[#F5F5F5] transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
        compact
          ? 'px-3 py-1.5 text-xs font-medium min-h-[36px]'
          : 'w-full px-3 py-2 text-xs font-medium min-h-[38px]'
      }`}
    >
      <GoogleIcon className="w-3.5 h-3.5 text-[#F5F5F5] shrink-0 transition-transform group-hover:scale-110" />
      <span className="whitespace-nowrap font-medium">
        {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
      </span>
    </button>
  );
};
