import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const ResetPassword = ({ onBackToLogin }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Extract token from URL ?token=xxxxx
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) {
      toast.error('Invalid or missing reset token.');
    } else {
      setToken(t);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await API.post('/auth/reset-password', { token, password });
      setDone(true);
      toast.success('Password reset successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 font-sans antialiased text-[#1E293B]">
      <div className="w-full max-w-[400px] bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">

        <h2 className="text-2xl font-bold text-slate-800 text-center tracking-tight mb-2">
          Set New Password
        </h2>
        <p className="text-center text-slate-500 text-sm mb-6">
          Choose a strong new password for your account.
        </p>

        {done ? (
          <div className="text-center space-y-4">
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl font-semibold text-sm">
               Password updated successfully!
            </div>
            <button
              onClick={onBackToLogin}
              className="w-full py-3 rounded-xl font-bold text-sm bg-[#2563EB] text-white hover:bg-blue-700 transition-all"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                New Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                Confirm New Password:
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your new password"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all active:scale-95 ${
                loading || !token ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-blue-700'
              }`}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;