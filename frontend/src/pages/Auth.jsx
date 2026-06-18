import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
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
    const payload = isLoginMode 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await axios.post(`http://localhost:3000${endpoint}`, payload);
      
      if (isLoginMode) {
        // Save the authenticated token and user metadata into browser local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Signal back to App.jsx that the portal is now unlocked!
        onLoginSuccess(response.data.user);
      } else {
        setMessage('👤 Account created successfully! Please switch to login mode.');
        setFormData({ name: '', email: '', password: '', role: 'user' });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during authentication.');
    }
  };

  const inputStyle = { width: '100%', padding: '10px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '15px', color: '#2d3748', outline: 'none', boxSizing: 'border-box', marginBottom: '14px' };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '32px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)', border: '1px solid #edf2f7', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '24px', textAlign: 'center', fontWeight: 'bold' }}>
        {isLoginMode ? '🔐 Helpdesk Portal Login' : '📝 Create Operations Account'}
      </h2>

      {message && <div style={{ backgroundColor: '#e6fffa', color: '#319795', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontWeight: '600', textAlign: 'center', fontSize: '14px' }}>{message}</div>}
      {error && <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontWeight: '600', textAlign: 'center', fontSize: '14px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {!isLoginMode && (
          <div>
            <label style={{ fontWeight: '600', color: '#4a5568', fontSize: '14px', display: 'block', marginBottom: '4px' }}>Full Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} required />
          </div>
        )}

        <div>
          <label style={{ fontWeight: '600', color: '#4a5568', fontSize: '14px', display: 'block', marginBottom: '4px' }}>Corporate Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required />
        </div>

        <div>
          <label style={{ fontWeight: '600', color: '#4a5568', fontSize: '14px', display: 'block', marginBottom: '4px' }}>Secure Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} required />
        </div>

        {!isLoginMode && (
          <div>
            <label style={{ fontWeight: '600', color: '#4a5568', fontSize: '14px', display: 'block', marginBottom: '4px' }}>Account Authority Classification:</label>
            <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
              <option value="user">Standard User (Submit Tickets)</option>
              <option value="technician">Operations Technician (Manage Queue & Notes)</option>
              <option value="admin">System Administrator (Full Access + Purge Control)</option>
            </select>
          </div>
        )}

        <button type="submit" style={{ background: '#2c3e50', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '16px', transition: 'background-color 0.2s', marginTop: '10px' }}>
          {isLoginMode ? 'Sign In' : 'Register Profile'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', color: '#718096', fontSize: '14px' }}>
        {isLoginMode ? "New to the department? " : "Already registered? "}
        <span onClick={() => { setIsLoginMode(!isLoginMode); setError(''); setMessage(''); }} style={{ color: '#3182ce', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLoginMode ? 'Create an account' : 'Sign in here'}
        </span>
      </p>
    </div>
  );
};

export default Auth;
