import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ onLoginSuccess, onCancelAuth }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    
    // Notice we do NOT send a role parameter anymore. The backend will enforce 'user' by default.
    const payload = isLoginMode 
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await axios.post(`http://localhost:3000${endpoint}`, payload);
      
      if (isLoginMode) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLoginSuccess(response.data.user);
      } else {
        setMessage('Account created successfully! Please switch to sign in mode.');
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during authentication.');
    }
  };

  const inputStyle = { width: '100%', padding: '10px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '15px', color: '#2d3748', outline: 'none', boxSizing: 'border-box', marginBottom: '14px' };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 font-sans antialiased text-[#1E293B]">
      <div className="w-full max-w-[400px] bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <h2 className="text-2xl font-black text-slate-800 text-center tracking-tight mb-4">
          {isLoginMode ? ' Helpdesk Portal Login' : ' Create Operations Account'}
        </h2>

        <button
          type="button"
          onClick={onCancelAuth}
          className="w-full mb-6 py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition-all active:scale-95"
        >
          ← Cancel and Return to Homepage
        </button>

        {message && <div className="bg-emerald-50 text-[#22C55E] border border-emerald-100 p-3 rounded-xl text-center font-semibold text-xs mb-4">{message}</div>}
        {error && <div className="bg-rose-50 text-[#EF4444] border border-rose-100 p-3 rounded-xl text-center font-semibold text-xs mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Full Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} required />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Corporate Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Secure Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} required />
          </div>

          <button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 mt-2">
            {isLoginMode ? 'Sign In' : 'Register Profile'}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-500 text-sm">
          {isLoginMode ? "New to the department? " : "Already registered? "}
          <span onClick={() => { setIsLoginMode(!isLoginMode); setError(''); setMessage(''); }} className="text-[#2563EB] cursor-pointer font-bold hover:underline">
            {isLoginMode ? 'Create an account' : 'Sign in here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
