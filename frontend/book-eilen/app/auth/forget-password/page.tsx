'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type RequestResetValues = { email: string };
type ResetPasswordValues = { password: string; confirmPassword: string };

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [resetCode, setResetCode] = useState(''); // ✅ store OTP here

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0b0b] via-[#111] to-black px-4">
      <div className="w-full max-w-xl bg-[#111] border border-white/5 rounded-2xl shadow-[0_0_40px_rgba(226,12,17,0.15)] p-8 relative">

        {/* Top Red Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#E20C11] rounded-t-2xl" />

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-white/60 mb-1 text-lg font-medium">Welcome to</p>
          <h1 className="text-3xl font-bold text-white">
            Book<span className="text-[#E20C11]">Eilen</span>
          </h1>
        </div>

        {/* Step Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['email', 'verify', 'reset'] as const).map((s, i) => {
            const currentIdx = ['email', 'verify', 'reset'].indexOf(step);
            return (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-6 bg-[#E20C11]' : currentIdx > i ? 'w-2 bg-[#E20C11]/40' : 'w-2 bg-white/10'
                }`}
              />
            );
          })}
        </div>

        {step === 'email' && (
          <RequestResetCode
            onCodeSent={(email) => {
              setUserEmail(email);
              setStep('verify');
            }}
          />
        )}

        {step === 'verify' && (
          <VerifyCodeForm
            email={userEmail}
            onChangeEmail={() => setStep('email')}
            onVerified={(code) => {
              setResetCode(code); // ✅ save the OTP from verify step
              setStep('reset');
            }}
          />
        )}

        {step === 'reset' && (
          <ResetPasswordForm
            email={userEmail}
            code={resetCode} // ✅ pass saved OTP to reset step
            onSuccess={() => router.push('/auth/login-form')}
          />
        )}

        <div className="text-center mt-6">
          <Link
            href="/auth/login-form"
            className="text-sm text-white/30 hover:text-[#E20C11] transition font-medium"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Send Code ─────────────────────────────────────────────────────────
function RequestResetCode({ onCodeSent }: { onCodeSent: (email: string) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RequestResetValues>();
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const onSubmit = async (data: RequestResetValues) => {
    setMessage(null);
    try {
      const res = await fetch('http://localhost:3041/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage({ text: 'Reset code sent! Check your inbox.', ok: true });
        setTimeout(() => onCodeSent(data.email), 1200);
      } else {
        setMessage({ text: result.message || 'Failed to send reset code.', ok: false });
      }
    } catch {
      setMessage({ text: 'Network error. Please try again.', ok: false });
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Forgot Password?</h2>
        <p className="text-white/40 text-sm mt-1">Enter your email to receive a 6-digit reset code.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-5">
          <label className="text-sm font-medium text-white/60">Email Address</label>
          <input
            type="email"
            autoComplete="email"
            className={`w-full mt-2 px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border ${
              errors.email ? 'border-red-500' : 'border-gray-700'
            } focus:outline-none focus:border-[#E20C11] focus:ring-2 focus:ring-[#E20C11]/20 transition`}
            placeholder="Enter your email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/i, message: 'Invalid email address' },
            })}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{String(errors.email.message)}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 rounded-full bg-[#E20C11] text-white font-semibold hover:bg-red-600 transition hover:shadow-[0_6px_20px_rgba(226,12,17,0.4)] disabled:opacity-60"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Code'}
        </button>

        {message && (
          <div className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium border ${
            message.ok
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.ok ? '✓ ' : '✕ '}{message.text}
          </div>
        )}
      </form>
    </>
  );
}

// ─── Step 2: Verify OTP ────────────────────────────────────────────────────────
function VerifyCodeForm({
  email,
  onChangeEmail,
  onVerified,
}: {
  email: string;
  onChangeEmail: () => void;
  onVerified: (code: string) => void; // ✅ returns code to parent
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    // auto-submit when all 6 filled
    if (value && next.every(d => d !== '') && index === 5) handleVerify(next.join(''));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('http://localhost:3041/users/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage({ text: 'Code verified!', ok: true });
        setTimeout(() => onVerified(code), 800); // ✅ pass code up to parent
      } else {
        triggerShake();
        setMessage({ text: result.message || 'Invalid or expired code.', ok: false });
        setDigits(['', '', '', '', '', '']);
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    } catch {
      // If no verify endpoint, pass code directly and verify on final reset
      setMessage({ text: 'Proceeding to reset...', ok: true });
      setTimeout(() => onVerified(code), 600);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setMessage(null);
    try {
      const res = await fetch('http://localhost:3041/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setMessage({ text: 'New code sent to your email!', ok: true });
        setCountdown(60);
        setDigits(['', '', '', '', '', '']);
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      } else {
        setMessage({ text: 'Failed to resend. Try again.', ok: false });
      }
    } catch {
      setMessage({ text: 'Network error.', ok: false });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Check your email</h2>
        <p className="text-white/40 text-sm mt-1">
          We sent a 6-digit code to{' '}
          <span className="text-white/70 font-medium">{email}</span>{' '}
          <button
            onClick={onChangeEmail}
            className="text-[#E20C11] hover:text-red-400 transition text-xs font-semibold underline underline-offset-2"
          >
            change
          </button>
        </p>
      </div>

      <div className="mb-5">
        <label className="text-sm font-medium text-white/60">Verification Code</label>
        <div
          className="grid grid-cols-6 gap-2 mt-2"
          onPaste={handlePaste}
          style={shake ? { animation: 'shake 0.35s ease' } : {}}
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              autoFocus={i === 0}
              disabled={loading}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onFocus={e => e.target.select()}
              className={`
                aspect-square text-center text-xl font-bold rounded-lg bg-[#1a1a1a] text-white
                border transition-all focus:outline-none focus:ring-2
                ${d
                  ? 'border-[#E20C11]/50 focus:border-[#E20C11] focus:ring-[#E20C11]/20'
                  : 'border-gray-700 focus:border-[#E20C11] focus:ring-[#E20C11]/20'
                }
              `}
              style={{ caretColor: '#E20C11' }}
            />
          ))}
        </div>

        <style>{`
          @keyframes shake {
            0%,100% { transform: translateX(0); }
            20% { transform: translateX(-5px); }
            40% { transform: translateX(5px); }
            60% { transform: translateX(-5px); }
            80% { transform: translateX(5px); }
          }
        `}</style>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-white/30">
            {countdown > 0 ? `Resend in ${countdown}s` : "Didn't get it?"}
          </span>
          <button
            onClick={handleResend}
            disabled={countdown > 0 || resendLoading}
            className="text-xs font-semibold text-[#E20C11] hover:text-red-400 transition disabled:text-white/20 disabled:cursor-not-allowed"
          >
            {resendLoading ? 'Sending...' : 'Resend code'}
          </button>
        </div>
      </div>

      <button
        onClick={() => { const c = digits.join(''); if (c.length === 6) handleVerify(c); }}
        disabled={loading || digits.join('').length < 6}
        className="w-full py-3 rounded-full bg-[#E20C11] text-white font-semibold hover:bg-red-600 transition hover:shadow-[0_6px_20px_rgba(226,12,17,0.4)] disabled:opacity-60"
      >
        {loading ? 'Verifying...' : 'Verify Code'}
      </button>

      {message && (
        <div className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium border ${
          message.ok
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.ok ? '✓ ' : '✕ '}{message.text}
        </div>
      )}
    </>
  );
}

// ─── Step 3: New Password ──────────────────────────────────────────────────────
function ResetPasswordForm({
  email,
  code, // ✅ received from parent state
  onSuccess,
}: {
  email: string;
  code: string;
  onSuccess: () => void;
}) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [done, setDone] = useState(false);

  const password = watch('password', '');

  const getStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getStrength(password);

  const onSubmit = async (data: ResetPasswordValues) => {
    setMessage(null);
    try {
      const res = await fetch('http://localhost:3041/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code,           // ✅ the saved OTP from step 2
          newPassword: data.password,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setDone(true);
        setTimeout(() => onSuccess(), 2000);
      } else {
        setMessage({ text: result.message || 'Failed to reset password.', ok: false });
      }
    } catch {
      setMessage({ text: 'Network error. Please try again.', ok: false });
    }
  };

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Password Reset!</h2>
        <p className="text-white/40 text-sm">Your password has been updated. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Set New Password</h2>
        <p className="text-white/40 text-sm mt-1">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* New Password */}
        <div className="mb-5">
          <label className="text-sm font-medium text-white/60">New Password</label>
          <div className="relative mt-2">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`w-full px-4 py-3 pr-11 rounded-lg bg-[#1a1a1a] text-white border ${
                errors.password ? 'border-red-500' : 'border-gray-700'
              } focus:outline-none focus:border-[#E20C11] focus:ring-2 focus:ring-[#E20C11]/20 transition`}
              style={
                !showPassword && password // apply only when hidden and has value
                    ? { fontSize: '1.4rem', letterSpacing: '0.18em', fontFamily: 'serif' }
                    : {}
            }
              placeholder="At least 8 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {password && (
            <div className="flex gap-1 mt-2">
              {[0,1,2,3].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i < strength
                    ? strength <= 1 ? 'bg-red-500' : strength <= 2 ? 'bg-yellow-500' : 'bg-green-500'
                    : 'bg-white/10'
                }`} />
              ))}
            </div>
          )}
          {errors.password && <p className="text-red-500 text-xs mt-1">{String(errors.password.message)}</p>}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="text-sm font-medium text-white/60">Confirm Password</label>
          <div className="relative mt-2">
            <input
              type={showConfirm ? 'text' : 'password'}
              className={`w-full px-4 py-3 pr-11 rounded-lg bg-[#1a1a1a] text-white border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
              } focus:outline-none focus:border-[#E20C11] focus:ring-2 focus:ring-[#E20C11]/20 transition`}
              style={
                !showPassword && password // apply only when hidden and has value
                    ? { fontSize: '1.4rem', letterSpacing: '0.18em', fontFamily: 'serif' }
                    : {}
            }
              placeholder="Repeat your password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: val => val === password || 'Passwords do not match',
              })}
            />
            <button type="button" onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{String(errors.confirmPassword.message)}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}
          className="w-full py-3 rounded-full bg-[#E20C11] text-white font-semibold hover:bg-red-600 transition hover:shadow-[0_6px_20px_rgba(226,12,17,0.4)] disabled:opacity-60">
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>

        {message && (
          <div className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium border ${
            message.ok
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.ok ? '✓ ' : '✕ '}{message.text}
          </div>
        )}
      </form>
    </>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}