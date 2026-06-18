import React, { useState } from 'react';
import { createNewTicket } from '../services/api';

const CreateTicket = () => {
  // 1. Set up React local state to capture what the user types in the input boxes
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'Hardware', // Default pick
    priority: 'Low'       // Default pick
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 2. A helper function to dynamically track typing changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Form Submission Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Send data to your Node.js backend port 3000 via Axios
      const response = await createNewTicket(formData);
      setMessage(response.data.message);
      
      // Clear form boxes on success
      setFormData({ subject: '', description: '', category: 'Hardware', priority: 'Low' });
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while creating the ticket.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2> File a New Support Ticket</h2>
      
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Subject:</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} required />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={{ width: '100%', padding: '8px', marginTop: '5px' }} required></textarea>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
            <option value="Account Access">Account Access</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Priority:</label>
          <select name="priority" value={formData.priority} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
