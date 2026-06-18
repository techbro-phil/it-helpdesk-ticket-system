import React, { useState, useEffect } from 'react';
import CreateTicket from './pages/CreateTicket';
import TicketList from './pages/TicketList';
import Auth from './pages/Auth';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if a valid session exists when the browser window first boots up
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>⏳ Verifying system session...</p>;

  // GUARD: If no active user profile is found in memory, block layout and show Auth view
  if (!currentUser) {
    return <Auth onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '30px', maxWidth: '1000px', margin: '0 auto 30px auto' }}>
        <h1 style={{ color: '#333', margin: 0, fontSize: '24px' }}>编️ IT Helpdesk Operations Workspace</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#4a5568', backgroundColor: '#edf2f7', padding: '6px 12px', borderRadius: '20px', fontWeight: '500' }}>
            👤 {currentUser.name} ({currentUser.role})
          </span>
          <button onClick={handleLogout} style={{ backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            Sign Out
          </button>
        </div>
      </header>
      
        <main style={{ marginTop: '20px' }}>
          {/* Everyone can file a ticket */}
         <CreateTicket />
  
         {/* ROLE CHECK: Only Technicians and Admins can see the global operational dashboard grid */}
         {(currentUser.role === 'technician' || currentUser.role === 'admin') && (
           <TicketList currentUser={currentUser} />
  )}
         </main>
    </div>
  );
}

export default App;
