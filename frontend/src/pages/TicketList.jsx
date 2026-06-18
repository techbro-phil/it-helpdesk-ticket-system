import React, { useState, useEffect } from 'react';
import { fetchAllTickets } from '../services/api';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await fetchAllTickets();
        setTickets(response.data);
      } catch (err) {
        setError('Failed to load tickets from the server.');
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

  // Helper styling functions for visual indicators
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical': return { color: '#d9534f', backgroundColor: '#fdf7f7', border: '1px solid #d9534f' };
      case 'High': return { color: '#f0ad4e', backgroundColor: '#fcf8e3', border: '1px solid #f0ad4e' };
      case 'Medium': return { color: '#0275d8', backgroundColor: '#f0f7fd', border: '1px solid #0275d8' };
      default: return { color: '#5cb85c', backgroundColor: '#f4f9f4', border: '1px solid #5cb85c' };
    }
  };

  if (loading) return <p style={{ textAlign: 'center', color: '#666' }}>⏳ Loading active tickets...</p>;
  if (error) return <p style={{ color: '#d9534f', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>;

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '20px auto 40px auto', 
      padding: '24px', 
      backgroundColor: '#ffffff', 
      borderRadius: '12px', 
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f4f6f9', paddingBottom: '12px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '22px' }}>📋 Active Operations Queue</h2>
        <span style={{ backgroundColor: '#2c3e50', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          {tickets.length} Total
        </span>
      </div>
      
      {tickets.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7f8c8d', margin: '4px 0' }}>No support tickets registered in the data engine.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', color: '#7f8c8d', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>
                <th style={{ padding: '14px', borderBottom: '2px solid #edf2f7' }}>ID</th>
                <th style={{ padding: '14px', borderBottom: '2px solid #edf2f7' }}>Subject Summary</th>
                <th style={{ padding: '14px', borderBottom: '2px solid #edf2f7' }}>Classification</th>
                <th style={{ padding: '14px', borderBottom: '2px solid #edf2f7' }}>Urgency</th>
                <th style={{ padding: '14px', borderBottom: '2px solid #edf2f7' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => (
                <tr key={ticket.id} style={{ 
                  borderBottom: '1px solid #edf2f7',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfdfe',
                  transition: 'background-color 0.2s'
                }}>
                  <td style={{ padding: '14px', fontWeight: '600', color: '#a0aec0' }}>#{ticket.id}</td>
                  <td style={{ padding: '14px', fontWeight: '500', color: '#2d3748' }}>{ticket.subject}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ backgroundColor: '#edf2f7', color: '#4a5568', padding: '5px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>
                      {ticket.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      ...getPriorityStyle(ticket.priority)
                    }}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      backgroundColor: ticket.status === 'Open' ? '#e6fffa' : '#feebc8',
                      color: ticket.status === 'Open' ? '#319795' : '#c05621',
                      padding: '5px 10px', 
                      borderRadius: '6px', 
                      fontSize: '13px', 
                      fontWeight: '700'
                    }}>
                      {ticket.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TicketList;
