'use client';

import { FormEvent, useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Replace this with your real API call
      console.log('Reset link requested for:', email);
      setSubmitted(true);
    } catch (error) {
      console.error('Error sending reset link:', error);
    }
  };

  if (submitted) {
    return (
      <div className="radaa-login-bg">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">Check your inbox</h2>
          <p className="text-white/90">We’ve sent a password reset link to <strong>{email}</strong>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="radaa-login-bg">
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-white">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-white/50 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
