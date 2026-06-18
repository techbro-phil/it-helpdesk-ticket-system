import React, { useState, useEffect } from 'react';
import { fetchAllTickets, deleteTicketById, fetchTicketById } from '../services/api';
import axios from 'axios'; // For pulling notes directly
import DashboardMetrics from '../components/DashboardMetrics';


const TicketList = ({ currentUser }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for Managing the Active "Details" View
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  // 1. Load the Dashboard Queue
  const loadTickets = async () => {
    try {
      const response = await fetchAllTickets();
      setTickets(response.data);
    } catch (err) {
      setError('Failed to load tickets from the data engine.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // 2. Handle Ticket Deletion (Instant UI update)
  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to permanently delete ticket #${id}?`)) {
      try {
        await deleteTicketById(id);
        // Remove it from our local state array immediately so the user sees it disappear
        setTickets(tickets.filter(t => t.id !== id));
        if (selectedTicket?.id === id) setSelectedTicket(null); // Close details if open
      } catch (err) {
        alert('Error executing data deletion.');
      }
    }
  };

  // 3. Handle Opening Ticket Details & Fetching its Tech Notes
  const handleViewDetails = async (ticket) => {
    try {
      setSelectedTicket(ticket);
      setNewNote('');
      // Request notes belonging to this specific ticket via Axios from port 3000
      const notesRes = await axios.get(`http://localhost:3000/notes/ticket/${ticket.id}`);
      setNotes(notesRes.data);
    } catch (err) {
      console.error('Error fetching technician notes:', err.message);
    }
  };

  // 4. Handle Adding a New Technician Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/notes', {
        ticket_id: selectedTicket.id,
        note: newNote
      });
      
      // Append the newly created note to the top of our local notes list
      setNotes([response.data.note[0], ...notes]);
      setNewNote('');
    } catch (err) {
      alert('Failed to save technician note.');
    }
  };

  // Priority badge styling color mapper
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
    <div style={{ maxWidth: '1000px', margin: '20px auto 40px auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Inject Analytics Counter Cards Here */}
    <DashboardMetrics tickets={tickets} />
    
      {/* SECTION A: THE LIVE OPERATIONS QUEUE TABLE */}
      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f4f6f9', paddingBottom: '12px' }}>
          <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '22px' }}>📋 Active Operations Queue</h2>
          <span style={{ backgroundColor: '#2c3e50', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
            {tickets.length} Active
          </span>
        </div>
        
        {tickets.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No support tickets currently registered.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', color: '#7f8c8d', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px' }}>ID</th>
                  <th style={{ padding: '14px' }}>Subject Summary</th>
                  <th style={{ padding: '14px' }}>Classification</th>
                  <th style={{ padding: '14px' }}>Urgency</th>
                  <th style={{ padding: '14px' }}>Status</th>
                  <th style={{ padding: '14px', textAnlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr key={ticket.id} style={{ borderBottom: '1px solid #edf2f7', backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfdfe' }}>
                    <td style={{ padding: '14px' }}>
                     <button onClick={() => handleViewDetails(ticket)} style={{ background: '#3182ce', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontSize: '12px', fontWeight: '600' }}>
                    View Details
                   </button>
  
                   {/* ONLY ADMINS CAN SEE AND CLICK THE DELETE BUTTON */}
                   {currentUser?.role === 'admin' && (
               <button onClick={() => handleDelete(ticket.id)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                 Delete
               </button>
                  )}
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', ...getPriorityStyle(ticket.priority) }}>{ticket.priority}</span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ backgroundColor: ticket.status === 'Open' ? '#e6fffa' : '#feebc8', color: ticket.status === 'Open' ? '#319795' : '#c05621', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>{ticket.status}</span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <button onClick={() => handleViewDetails(ticket)} style={{ background: '#3182ce', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontSize: '12px', fontWeight: '600' }}>
                        View Details
                      </button>
                      <button onClick={() => handleDelete(ticket.id)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION B: DYNAMIC TICKET DETAILS & TECHNICIAN NOTES LOOKUP */}
      {selectedTicket && (
        <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '12px', boxShadow: '0 6px 16px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #edf2f7', paddingBottom: '14px', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#2d3748' }}>🔍 Case Details: {selectedTicket.subject} <span style={{ color: '#a0aec0' }}>#{selectedTicket.id}</span></h3>
            <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#a0aec0' }}>&times;</button>
          </div>
          
          <p style={{ color: '#4a5568', backgroundColor: '#f7fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3182ce', lineHeight: '1.5', margin: '0 0 20px 0' }}>
            <strong>Description:</strong> {selectedTicket.description}
          </p>

          {/* TECHNICIAN NOTES LIST */}
          <h4 style={{ color: '#4a5568', marginBottom: '10px' }}>👨‍💻 Internal Troubleshooting Logs</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', paddingRight: '5px' }}>
            {notes.length === 0 ? (
              <p style={{ color: '#a0aec0', fontSize: '14px', italic: 'true' }}>No internal work notes log recorded for this case yet.</p>
            ) : (
              notes.map(n => (
                <div key={n.id} style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '6px', marginBottom: '10px', borderLeft: '3px solid #718096', fontSize: '14px' }}>
                  <p style={{ margin: '0 0 4px 0', color: '#2d3748' }}>{n.note}</p>
                  <small style={{ color: '#a0aec0' }}>Logged on: {new Date(n.created_at).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>

          {/* ADD NOTE FORM INPUT */}
         {/* ONLY TECHNICIANS & ADMINS CAN SUBMIT PATCH NOTES */}
{(currentUser?.role === 'technician' || currentUser?.role === 'admin') ? (
  <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '10px' }}>
    <input 
      type="text" 
      value={newNote} 
      onChange={(e) => setNewNote(e.target.value)} 
      placeholder="Add technician patch notes or troubleshooting status updates here..." 
      style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e0', borderRadius: '6px', outline: 'none' }}
      required 
    />
    <button type="submit" style={{ background: '#2d3748', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
      Add Log Note
    </button>
  </form>
) : (
  <p style={{ color: '#718096', fontSize: '14px', fontStyle: 'italic', backgroundColor: '#f7fafc', padding: '12px', borderRadius: '6px', border: '1px dashed #cbd5e0', margin: 0 }}>
    🔒 Standard user accounts do not have engineering clearance to modify internal technical work logs.
  </p>
)}

        </div>
      )}

    </div>
  );
};

export default TicketList;
