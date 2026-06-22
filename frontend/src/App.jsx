import React, { useState, useEffect } from 'react';
import CreateTicket from './pages/CreateTicket';
import TicketList from './pages/TicketList';
import Auth from './pages/Auth';
import Landing from './pages/Landing'; // <-- 1. Verify this import is exactly here

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false); // <-- 2. Tracks whether we show Login or Landing

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

  // GUARD PANEL: Router for Unauthenticated Users
  if (!currentUser) {
    if (showLogin) {
      // If the user clicked "Sign In", open the Auth form panel
      return (
        <Auth 
          onLoginSuccess={(user) => { 
            setCurrentUser(user); 
            setShowLogin(false); 
          }} 
        />
      );
    }
    // By default, render the beautiful full-screen public Landing page!
    return <Landing onNavigateToLogin={() => setShowLogin(true)} />;
  }

  // PORTAL PANEL: Unlocked Dashboard workspace for authenticated Users/Techs/Admins
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] font-sans antialiased text-[#1E293B] p-6">
      <header className="max-w-7xl mx-auto flex justify-between items-center border-b border-slate-200 pb-5 mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">🛠️ IT Helpdesk Operations Workspace</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
            👤 {currentUser.name} ({currentUser.role})
          </span>
          <button 
            onClick={handleLogout} 
            className="bg-[#EF4444] hover:bg-red-600 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto space-y-12">
        {/* Everyone can file a support ticket input */}
        <CreateTicket />
        
        {/* ROLE CHECK: Only Technicians and Admins can view metrics cards and operations data grids */}
        {(currentUser.role === 'technician' || currentUser.role === 'admin') && (
          <TicketList currentUser={currentUser} />
        )}
      </main>
    </div>
  );
}

export default App;
