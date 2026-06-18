import React from 'react';
import CreateTicket from './pages/CreateTicket';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <header style={{ textAlign: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1> IT Helpdesk Ticketing Portal</h1>
      </header>
      <main>
        <CreateTicket />
      </main>
    </div>
  );
}

export default App;
