'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [userEmail, setUserEmail] = useState('');
  
  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body p-5">
          {step === 'email' ? (
            <RequestResetCode 
              onCodeSent={(email) => {
                setUserEmail(email);
                setStep('verify');
              }} 
            />
          ) : (
            <ResetPasswordForm 
              email={userEmail}
              onSuccess={() => router.push('/login')}
            />
          )}
          
          <div className="text-center mt-4">
            <button 
              type="button" 
              className="btn btn-link"
              onClick={() => router.push('/login')}
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component 1: Email Input & Send Code
function RequestResetCode({ onCodeSent }: { onCodeSent: (email: string) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:3040/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setMessage('✅ Reset code sent to your email!');
        setTimeout(() => onCodeSent(data.email), 1500);
      } else {
        setMessage(result.message || 'Failed to send reset code');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="h2 mb-3">Forgot Password?</h2>
      <p className="text-muted mb-4">Enter your email to receive a 6-digit reset code</p>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            id="email"
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="your@email.com"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
            })}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100"
        >
          {loading ? 'Sending...' : 'Send Reset Code'}
        </button>

        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} mt-3`}>
            {message}
          </div>
        )}
      </form>
    </>
  );
}

// Component 2: Verify Code & Reset Password
function ResetPasswordForm({ email, onSuccess }: { email: string; onSuccess: () => void }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const password = watch('password');

  const onSubmit = async (data: any) => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:3040/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: data.code,
          newPassword: data.password,
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setMessage('✅ Password reset successful!');
        setTimeout(() => onSuccess(), 2000);
      } else {
        setMessage(result.message || 'Failed to reset password');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="h2 mb-3">Reset Password</h2>
      <p className="text-muted mb-4">Enter the 6-digit code sent to <strong>{email}</strong></p>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="code" className="form-label">Verification Code</label>
          <input
            id="code"
            type="text"
            className={`form-control text-center ${errors.code ? 'is-invalid' : ''}`}
            placeholder="123456"
            maxLength={6}
            {...register('code', {
              required: 'Code is required',
              pattern: { value: /^[0-9]{6}$/, message: 'Code must be 6 digits' }
            })}
          />
          {errors.code && <div className="invalid-feedback">{errors.code.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">New Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' }
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Please confirm password',
                validate: val => val === password || 'Passwords do not match'
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword.message}</div>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} mt-3`}>
            {message}
          </div>
        )}
      </form>
    </>
  );
}