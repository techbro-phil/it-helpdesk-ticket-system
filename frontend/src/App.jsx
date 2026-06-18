import React from 'react';
import CreateTicket from './pages/CreateTicket';
import TicketList from './pages/TicketList'; // <-- Import your new component

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '30px' }}>
        <h1 style={{ color: '#333' }}>🛠️ IT Helpdesk Ticketing Portal</h1>
      </header>
      <main>
        {/* Top: Entry Form */}
        <CreateTicket />
        
        {/* Bottom: Live Database Queue */}
        <TicketList />
      </main>
    </div>
  );
}

export default App;
