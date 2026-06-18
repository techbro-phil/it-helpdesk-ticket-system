import React from 'react';

const DashboardMetrics = ({ tickets }) => {
  // 1. Calculate active statistics using basic JavaScript array filters
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'Open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
  
  // High/Critical tracking to give agents a quick look at severe system crashes
  const highPriority = tickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length;

  const cardStyle = {
    flex: 1,
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.02)',
    border: '1px solid #edf2f7',
    textAlign: 'center'
  };

  const numberStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '8px 0 0 0',
    color: '#2d3748'
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto 25px auto', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ color: '#4a5568', margin: '0 0 15px 0', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        📊 System Performance Metrics
      </h3>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <span style={{ color: '#718096', fontSize: '14px', fontWeight: '500' }}>Total Backlog</span>
          <p style={numberStyle}>{totalTickets}</p>
        </div>

        <div style={{ ...cardStyle, borderTop: '4px solid #319795' }}>
          <span style={{ color: '#319795', fontSize: '14px', fontWeight: '600' }}>🟢 Open Status</span>
          <p style={{ ...numberStyle, color: '#319795' }}>{openTickets}</p>
        </div>

        <div style={{ ...cardStyle, borderTop: '4px solid #dd6b20' }}>
          <span style={{ color: '#dd6b20', fontSize: '14px', fontWeight: '600' }}>🟠 In Progress</span>
          <p style={{ ...numberStyle, color: '#dd6b20' }}>{inProgressTickets}</p>
        </div>

        <div style={{ ...cardStyle, borderTop: '4px solid #e53e3e' }}>
          <span style={{ color: '#e53e3e', fontSize: '14px', fontWeight: '600' }}>🔴 Escalated / Urgent</span>
          <p style={{ ...numberStyle, color: '#e53e3e' }}>{highPriority}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
