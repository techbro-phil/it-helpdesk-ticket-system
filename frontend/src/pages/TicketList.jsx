import React, { useState, useEffect } from 'react';
import { fetchAllTickets, deleteTicketById, updateTicketDetails } from '../services/api';
import DashboardMetrics from '../components/DashboardMetrics';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const TicketList = ({ currentUser }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for Managing the Active Case Details View
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  // Load the Dashboard Queue with permission parameters
  const loadTickets = async () => {
    try {
      const response = await fetchAllTickets(currentUser.id, currentUser.role);
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

  // Handle Ticket Deletion (Admins Only)
  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to permanently delete ticket #${id}?`)) {
      try {
        await deleteTicketById(id, currentUser.role);
        setTickets(tickets.filter(t => t.id !== id));
        if (selectedTicket?.id === id) setSelectedTicket(null);
      } catch (err) {
        alert(err.response?.data?.error || 'Error executing data deletion.');
      }
    }
  };

  // Handle Technician Claiming an Open Ticket
  const handleClaimTicket = async (ticketId) => {
    try {
      await updateTicketDetails(ticketId, {
        status: 'In Progress',
        assigned_to: currentUser.id
      });
      alert('Ticket successfully assigned to your workspace profile.');
      loadTickets(); // Refresh data layout
      if (selectedTicket?.id === ticketId) setSelectedTicket(null);
    } catch (err) {
      alert('Failed to complete ticket assignment.');
    }
  };

  // Handle Technician Resolving an Active Ticket
  const handleResolveTicket = async (ticketId) => {
    try {
      await updateTicketDetails(ticketId, {
        status: 'Resolved'
      });
      alert('Ticket successfully marked as resolved.');
      loadTickets(); // Refresh data layout
      if (selectedTicket?.id === ticketId) setSelectedTicket(null);
    } catch (err) {
      alert('Failed to update ticket status.');
    }
  };

  // Handle Opening Ticket Details & Fetching its Tech Notes
  const handleViewDetails = async (ticket) => {
    try {
      setSelectedTicket(ticket);
      setNewNote('');
      const notesRes = await axios.get('https://it-helpdesk-ticket-system-89kz.onrender.com/auth/users');
      setNotes(notesRes.data);
    } catch (err) {
      console.error('Error fetching technician notes:', err.message);
    }
  };

  // Handle Adding a New Troubleshooting Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const response = await axios.post('https://it-helpdesk-ticket-system-89kz.onrender.com/notes', {
        ticket_id: selectedTicket.id,
        note: newNote
      });
      
      setNotes([response.data.note, ...notes]);
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

  if (loading) return <p className="text-center text-slate-500 py-10">Loading queue infrastructure...</p>;
  if (error) return <p className="text-center text-rose-500 font-bold py-10">{error}</p>;

  return (
    <div className="w-full mx-auto font-sans antialiased text-[#1E293B]">
      
      {/* Metrics Section */}
      <DashboardMetrics tickets={tickets} />
      
      {/* OPERATIONS QUEUE TABLE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md mb-8">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Operations Queue</h2>
          <span className="bg-slate-900 text-white px-4 py-1 rounded-full font-bold text-xs">
            {tickets.length} Registered
          </span>
        </div>
        
        {tickets.length === 0 ? (
          <p className="text-center text-slate-500 py-6">No support incidents registered in the workspace system queue.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Subject Summary</th>
                  <th className="p-4">Classification</th>
                  <th className="p-4">Urgency</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr key={ticket.id} className={`border-b border-slate-100 text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="p-4 font-bold text-slate-400">#{ticket.id}</td>
                    <td className="p-4 font-semibold text-slate-800">{ticket.subject}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-semibold">{ticket.category}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-md text-xs font-bold" style={getPriorityStyle(ticket.priority)}>{ticket.priority}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-600">
                      {ticket.assigned_to ? `Tech Account #${ticket.assigned_to}` : 'Unassigned'}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${
                        ticket.status === 'Open' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                        ticket.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                        'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center items-center gap-2">
                      <button onClick={() => handleViewDetails(ticket)} className="bg-blue-600 hover:bg-blue-700 text-white border-none px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm">
                        View Details
                      </button>

                      {/* TECHNICIAN WORKFLOW OPTIONS */}
                      {(currentUser.role === 'technician' || currentUser.role === 'admin') && (
                        <>
                          {ticket.status === 'Open' && (
                            <button onClick={() => handleClaimTicket(ticket.id)} className="bg-amber-500 hover:bg-amber-600 text-white border-none px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm">
                              Claim Ticket
                            </button>
                          )}
                          {ticket.status === 'In Progress' && ticket.assigned_to === currentUser.id && (
                            <button onClick={() => handleResolveTicket(ticket.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white border-none px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm">
                              Mark Resolved
                            </button>
                          )}
                        </>
                      )}
                      
                      {/* ADMIN EXCLUSIVE PURGE PARAMETER */}
                      {currentUser?.role === 'admin' && (
                        <button onClick={() => handleDelete(ticket.id)} className="bg-red-500 hover:bg-red-600 text-white border-none px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DYNAMIC CASE DETAILS PANEL */}
      {selectedTicket && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-lg font-bold text-slate-900">Case Investigation: {selectedTicket.subject} <span className="text-slate-400">#{selectedTicket.id}</span></h3>
            <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
          </div>
          
          <p className="color-slate-700 bg-slate-50 p-4 rounded-xl border-l-4 border-blue-600 text-sm leading-relaxed mb-6">
            <strong>Description:</strong> {selectedTicket.description}
          </p>


          {/* TROUBLESHOOTING LOG NOTES LIST */}
          <div className="mb-6">
            <h4 className="text-md font-bold text-slate-800 mb-3">Internal Activity Logs</h4>

            {notes.length === 0 ? (
              <p className="text-sm text-slate-500">
                No internal engineering modifications recorded for this file index.
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((n, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm">
                    <p>{n.note}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      Logged: {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ROLE CHECK: ACCESS CONTROL NOTE FORMS */}
          {(currentUser?.role === 'technician' || currentUser?.role === 'admin') ? (
            <form onSubmit={handleAddNote} className="flex gap-3 items-center">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Append operational patch annotations or troubleshooting notes here..."
                className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
                required
              />

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-bold"
              >
                Save Log
              </button>
            </form>
          ) : (
            <p className="text-sm text-slate-500">
              Account status does not possess structural authority clearance parameters to submit engineering logs.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketList;
