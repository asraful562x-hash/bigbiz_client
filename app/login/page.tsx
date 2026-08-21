'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './login.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://bigbiz-backend.onrender.com';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleType, setRoleType] = useState<'seller' | 'buyer'>('seller');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch(`${API_BASE}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          setSuccessMessage('Login successful! Redirecting to workspace...');
          setTimeout(() => {
            window.location.href = '/';
          }, 800);
        } else {
          setErrorMessage(data.message || 'Invalid email or password');
        }
      } else {
        const res = await fetch(`${API_BASE}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName,
            company_name: companyName,
            email,
            role_type: roleType,
            password,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setSuccessMessage('Account created successfully! Redirecting...');
          setTimeout(() => {
            window.location.href = '/';
          }, 800);
        } else {
          setErrorMessage(data.message || 'Failed to register account');
        }
      }
    } catch {
      setErrorMessage('Server connection error. Please ensure Go backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-root">
      {/* Ambient background blobs */}
      <div className="login-blob login-blob--blue" aria-hidden="true" />
      <div className="login-blob login-blob--indigo" aria-hidden="true" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo__icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="10" r="5" fill="currentColor" opacity="0.9"/>
              <circle cx="8"  cy="27" r="5" fill="currentColor" opacity="0.7"/>
              <circle cx="28" cy="27" r="5" fill="currentColor" opacity="0.7"/>
              <line x1="18" y1="14" x2="8"  y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18" y1="14" x2="28" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8"  y1="27" x2="28" y2="27" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <h1 className="login-logo__name">BizSocial</h1>
        </div>

        <p className="login-tagline">
          Empowering Professionals. Connecting Businesses.
        </p>

        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', background: 'hsl(222, 35%, 8%)', padding: '4px', borderRadius: '12px' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(null); setSuccessMessage(null); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'login' ? 'hsl(214, 89%, 52%)' : 'transparent',
              color: mode === 'login' ? '#fff' : 'hsl(215, 20%, 65%)',
              transition: 'all 0.2s',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(null); setSuccessMessage(null); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'register' ? 'hsl(214, 89%, 52%)' : 'transparent',
              color: mode === 'register' ? '#fff' : 'hsl(215, 20%, 65%)',
              transition: 'all 0.2s',
            }}
          >
            Create Account
          </button>
        </div>

        {/* OAuth Buttons */}
        <div className="login-buttons">
          {/* Google */}
          <a
            id="btn-login-google"
            href={`${API_BASE}/api/auth/google`}
            className="login-btn login-btn--google"
            aria-label="Continue with Google"
          >
            <span className="login-btn__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
            </span>
            <span>{mode === 'login' ? 'Continue with Google' : 'Sign Up with Google'}</span>
          </a>

          {/* Facebook */}
          <a
            id="btn-login-facebook"
            href={`${API_BASE}/api/auth/facebook`}
            className="login-btn login-btn--facebook"
            aria-label="Continue with Facebook"
          >
            <span className="login-btn__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
            </span>
            <span>{mode === 'login' ? 'Continue with Facebook' : 'Sign Up with Facebook'}</span>
          </a>
        </div>

        {/* Divider */}
        <div className="login-divider">
          <span>or with email</span>
        </div>

        {/* Alert Messages */}
        {errorMessage && (
          <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.75rem', marginBottom: '1rem' }}>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', fontSize: '0.75rem', marginBottom: '1rem' }}>
            {successMessage}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'register' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'hsl(215, 20%, 75%)', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'hsl(222, 35%, 8%)', border: '1px solid hsl(222, 25%, 22%)', color: '#fff', fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'hsl(215, 20%, 75%)', marginBottom: '4px' }}>Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Global"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'hsl(222, 35%, 8%)', border: '1px solid hsl(222, 25%, 22%)', color: '#fff', fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'hsl(215, 20%, 75%)', marginBottom: '4px' }}>Role Type</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setRoleType('seller')}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid', borderColor: roleType === 'seller' ? 'hsl(214, 89%, 52%)' : 'hsl(222, 25%, 22%)', background: roleType === 'seller' ? 'rgba(37, 99, 235, 0.2)' : 'transparent', color: roleType === 'seller' ? '#93c5fd' : 'hsl(215, 20%, 65%)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Seller
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleType('buyer')}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid', borderColor: roleType === 'buyer' ? 'hsl(214, 89%, 52%)' : 'hsl(222, 25%, 22%)', background: roleType === 'buyer' ? 'rgba(37, 99, 235, 0.2)' : 'transparent', color: roleType === 'buyer' ? '#93c5fd' : 'hsl(215, 20%, 65%)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Buyer
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'hsl(215, 20%, 75%)', marginBottom: '4px' }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'hsl(222, 35%, 8%)', border: '1px solid hsl(222, 25%, 22%)', color: '#fff', fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'hsl(215, 20%, 75%)', marginBottom: '4px' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'hsl(222, 35%, 8%)', border: '1px solid hsl(222, 25%, 22%)', color: '#fff', fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, hsl(214, 89%, 52%), hsl(240, 70%, 60%))',
              color: '#fff',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '6px',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign In to Workspace' : 'Create Business Account')}
          </button>
        </form>

        {/* Footer links */}
        <p className="login-footer" style={{ marginTop: '1.25rem' }}>
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="login-footer__link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="login-footer__link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Sign in
              </button>
            </>
          )}
        </p>

        <p className="login-terms">
          By continuing, you agree to our{' '}
          <Link href="/" className="login-footer__link">Terms</Link>
          {' '}and{' '}
          <Link href="/" className="login-footer__link">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
}
