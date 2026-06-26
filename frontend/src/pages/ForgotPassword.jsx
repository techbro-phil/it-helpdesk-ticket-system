import React, { useState } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error sending reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 font-sans antialiased text-[#1E293B]">
      <div className="w-full max-w-[400px] bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        
        <h2 className="text-2xl font-bold text-slate-800 text-center tracking-tight mb-2">
          Reset Password
        </h2>
        <p className="text-center text-slate-500 text-sm mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl font-semibold text-sm">
               Reset link sent! Check your inbox and spam folder.
            </div>
            <button
              onClick={onBackToLogin}
              className="w-full py-3 rounded-xl font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                Email Address:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all active:scale-95 ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-blue-700'
              }`}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full py-3 rounded-xl font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;