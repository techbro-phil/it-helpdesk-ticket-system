import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  fetchAllTickets,
  deleteTicketById,
  updateTicketDetails
} from '../services/api';

import DashboardMetrics from '../components/DashboardMetrics';

const TicketList = ({ currentUser }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedTicket, setSelectedTicket] = useState(null);

  const [notes, setNotes] = useState([]);

  const [newNote, setNewNote] = useState('');

  // Load Tickets

  const loadTickets = async () => {
    try {
      const response = await fetchAllTickets(
        currentUser.id,
        currentUser.role
      );

      setTickets(response.data);
    } catch (err) {
      setError(
        'Failed to load tickets from the data engine.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // Delete Ticket

  const handleDelete = async (id) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete ticket #${id}?`
      )
    ) {
      try {
        await deleteTicketById(
          id,
          currentUser.role
        );

        setTickets(
          tickets.filter(
            (t) => t.id !== id
          )
        );

        if (
          selectedTicket?.id === id
        ) {
          setSelectedTicket(null);
        }

      } catch (err) {

        alert(
          err.response?.data?.error ||
          'Error executing data deletion.'
        );

      }
    }
  };

  // Claim Ticket

  const handleClaimTicket = async (
    ticketId
  ) => {
    try {

      await updateTicketDetails(
        ticketId,
        {
          status: 'In Progress',
          assigned_to: currentUser.id
        }
      );

      alert(
        'Ticket successfully assigned to your workspace profile.'
      );

      loadTickets();

      if (
        selectedTicket?.id === ticketId
      ) {
        setSelectedTicket(null);
      }

    } catch (err) {

      alert(
        'Failed to complete ticket assignment.'
      );

    }
  };

  // Resolve Ticket

  const handleResolveTicket = async (
    ticketId
  ) => {
    try {

      await updateTicketDetails(
        ticketId,
        {
          status: 'Resolved'
        }
      );

      alert(
        'Ticket successfully marked as resolved.'
      );

      loadTickets();

      if (
        selectedTicket?.id === ticketId
      ) {
        setSelectedTicket(null);
      }

    } catch (err) {

      alert(
        'Failed to update ticket status.'
      );

    }
  };

  // View Details

  const handleViewDetails = async (
    ticket
  ) => {

    try {

      setSelectedTicket(ticket);

      setNewNote('');

      const notesRes =
        await axios.get(
          `http://localhost:3000/notes/ticket/${ticket.id}`
        );

      setNotes(notesRes.data);

    } catch (err) {

      console.error(
        'Error fetching technician notes:',
        err.message
      );

    }
  };

  // Add Note

  const handleAddNote = async (
    e
  ) => {

    e.preventDefault();

    if (!newNote.trim()) return;

    try {

      const response =
        await axios.post(
          'http://localhost:3000/notes',
          {
            ticket_id:
              selectedTicket.id,

            note: newNote
          }
        );

      setNotes([
        response.data.note,
        ...notes
      ]);

      setNewNote('');

    } catch (err) {

      alert(
        'Failed to save technician note.'
      );

    }
  };

  // Priority Colors

  const getPriorityStyle = (
    priority
  ) => {

    switch (priority) {

      case 'Critical':

        return {
          color: '#d9534f',
          backgroundColor:
            '#fdf7f7',
          border:
            '1px solid #d9534f'
        };

      case 'High':

        return {
          color: '#f0ad4e',
          backgroundColor:
            '#fcf8e3',
          border:
            '1px solid #f0ad4e'
        };

      case 'Medium':

        return {
          color: '#0275d8',
          backgroundColor:
            '#f0f7fd',
          border:
            '1px solid #0275d8'
        };

      default:

        return {
          color: '#5cb85c',
          backgroundColor:
            '#f4f9f4',
          border:
            '1px solid #5cb85c'
        };
    }
  };

  if (loading) {

    return (
      <p className="text-center text-slate-500 py-10">

        Loading queue infrastructure...

      </p>
    );
  }

  if (error) {

    return (
      <p className="text-center text-rose-500 font-bold py-10">

        {error}

      </p>
    );
  }

  return (

    <div className="w-full mx-auto font-sans antialiased text-[#1E293B]">

      <DashboardMetrics tickets={tickets} />

      {/* Queue */}

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md mb-8">

        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">

          <h2 className="text-xl font-bold">

            Active Operations Queue

          </h2>

          <span className="bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-bold">

            {tickets.length} Registered

          </span>

        </div>

        {tickets.length === 0 ? (

          <p className="text-center text-slate-500 py-6">

            No support incidents registered.

          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              {/* Keep your existing table body exactly as before */}

            </table>

          </div>

        )}

      </div>

      {/* DETAILS PANEL */}

      {selectedTicket && (

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">

          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">

            <h3 className="text-lg font-bold">

              Case Investigation:

              {selectedTicket.subject}

              <span className="text-slate-400">

                #{selectedTicket.id}

              </span>

            </h3>

            <button
              onClick={() =>
                setSelectedTicket(null)
              }
              className="text-xl font-bold"
            >
              &times;
            </button>

          </div>

          <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border-l-4 border-blue-600 mb-6">

            <strong>Description:</strong>

            {selectedTicket.description}

          </p>

          <h4 className="font-bold mb-4">

            Internal Activity Logs

          </h4>

          {notes.length === 0 ? (

            <div className="bg-slate-50 p-4 rounded-xl text-slate-500">

              No internal engineering modifications recorded.

            </div>

          ) : (

            <div className="space-y-3 mb-6">

              {notes.map((n) => (

                <div
                  key={n.id}
                  className="bg-slate-50 border p-4 rounded-xl"
                >

                  <p>{n.note}</p>

                  <p className="text-xs text-slate-400 mt-2">

                    Logged:

                    {' '}

                    {new Date(
                      n.created_at
                    ).toLocaleString()}

                  </p>

                </div>

              ))}

            </div>

          )}

          {(currentUser.role ===
            'technician' ||

            currentUser.role ===
            'admin') && (

            <form
              onSubmit={handleAddNote}
              className="flex gap-3"
            >

              <input

                type="text"

                value={newNote}

                onChange={(e) =>
                  setNewNote(
                    e.target.value
                  )
                }

                placeholder="Append troubleshooting notes..."

                className="flex-1 p-3 border rounded-xl"

                required

              />

              <button

                type="submit"

                className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-bold"

              >

                Save Log

              </button>

            </form>

          )}

        </div>

      )}

    </div>

  );
};

export default TicketList;