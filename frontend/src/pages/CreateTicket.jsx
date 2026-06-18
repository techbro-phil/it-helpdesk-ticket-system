import React, { useState } from 'react';
import { createNewTicket } from '../services/api';

const CreateTicket = () => {
  const [formData, setFormData] = useState({ subject: '', description: '', category: 'Hardware', priority: 'Low' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await createNewTicket(formData);
      setMessage(response.data.message);
      setFormData({ subject: '', description: '', category: 'Hardware', priority: 'Low' });
      // Quick trick: Reload page after 1.5 seconds so the list below auto-updates with our new entry!
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while creating the ticket.');
    }
  };

  const labelStyle = { display: 'block', fontWeight: '600', color: '#4a5568', marginBottom: '6px', fontSize: '14px' };
  const inputStyle = { width: '100%', padding: '10px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '15px', color: '#2d3748', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: '550px', margin: '0 auto 20px auto', padding: '28px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '22px', borderBottom: '2px solid #f4f6f9', paddingBottom: '12px' }}>📝 Request Technical Support</h2>
      
      {message && <div style={{ backgroundColor: '#e6fffa', color: '#319795', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontWeight: '600', textAlign: 'center' }}>{message}</div>}
      {error && <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontWeight: '600', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Issue Summary / Subject:</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} style={inputStyle} placeholder="e.g. Accounting printer offline" required />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Detailed Problem Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" style={inputStyle} placeholder="Provide details like error messages or troubleshooting steps already attempted..." required></textarea>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Category:</label>
            <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Account Access">Account Access</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Priority Tier:</label>
            <select name="priority" value={formData.priority} onChange={handleChange} style={inputStyle}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <button type="submit" style={{ background: '#2c3e50', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '16px', transition: 'background-color 0.2s' }}>
          Dispatch Support Ticket
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
