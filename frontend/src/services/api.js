import axios from 'axios';

const API = axios.create({
  // FIX: Points directly to your unique, live Render instance endpoint
  baseURL: 'https://it-helpdesk-ticket-system-89kz.onrender.com',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchAllTickets = (userId, role) => API.get(`/tickets?user_id=${userId}&role=${role}`);
export const createNewTicket = (ticketData) => API.post('/tickets', ticketData);
export const updateTicketDetails = (id, ticketData) => API.put(`/tickets/${id}`, ticketData);
export const deleteTicketById = (id, role) => API.delete(`/tickets/${id}?role=${role}`);


export default API;
