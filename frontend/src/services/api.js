import axios from 'axios';

// Create a reusable Axios instance pointing directly to your Node/Express backend port
const API = axios.create({
  baseURL: 'http://localhost:3000',
});

// Reusable functions matching your backend endpoints
export const fetchAllTickets = (userId, role) => API.get(`/tickets?user_id=${userId}&role=${role}`);
export const fetchTicketById = (id) => API.get(`/tickets/${id}`);
export const createNewTicket = (ticketData) => API.post('/tickets', ticketData);
export const updateTicketDetails = (id, updatedData) => API.put(`/tickets/${id}`, updatedData);
export const deleteTicketById = (id, role) => API.delete(`/tickets/${id}?role=${role}`);

export default API;
