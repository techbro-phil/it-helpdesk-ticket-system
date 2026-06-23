import React, { useState, useEffect } from 'react';
import CreateTicket from './pages/CreateTicket';
import TicketList from './pages/TicketList';
import Auth from './pages/Auth';
import Landing from './pages/Landing'; 
import UserManagement from './pages/UserManagement';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  
  // 1. ADDED: Tracks which sub-tab is currently active in your dashboard workspace
  const [activeTab, setActiveTab] = useState('Dashboard');

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

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}> Verifying system session...</p>;

  // GUARD PANEL: Router for Unauthenticated Users
  if (!currentUser) {
    if (showLogin) {
      return (
        <Auth 
          onLoginSuccess={(user) => { 
            setCurrentUser(user); 
            setShowLogin(false); 
          }} 
          onCancelAuth={() => setShowLogin(false)}
        />
      );
    }
    return <Landing onNavigateToLogin={() => setShowLogin(true)} />;
  }

  // PORTAL PANEL: Unlocked Dashboard workspace for authenticated Users/Techs/Admins
  return (
    <div className="flex w-full min-h-screen bg-[#F8FAFC] font-sans antialiased text-[#1E293B]">
      
      {/* =========================================================
          LEFT SIDEBAR CORE NAVIGATION COMPONENT 
         ========================================================= */}
      <aside className="fixed inset-y-0 left-0 z-20 w-64 bg-slate-900 text-slate-400 flex flex-col border-r border-slate-800 shadow-xl">
        {/* Sidebar Header Brand title */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
  <img src="/logo.png" alt="Myhelpdesk Logo" className="w-8 h-8 object-contain" />
  <span className="text-xl font-bold text-white tracking-tight">Myhelpdesk</span>
</div>


        {/* Sidebar Links Menu lists mapping */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('Dashboard')}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'Dashboard' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-slate-200'}`}
          >
            Dashboard Overview
          </button>

          <button 
            onClick={() => setActiveTab('New Ticket')}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'New Ticket' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-slate-200'}`}
          >
            File New Ticket
          </button>

          {/* 2. SECURITY GUARD: Only System Administrators can see the accounts directory link */}
          {currentUser.role === 'admin' && (
            <button 
              onClick={() => setActiveTab('Manage Users')}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'Manage Users' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-slate-200'}`}
            >
              Manage Accounts Directory
            </button>
          )}
        </nav>

        {/* Sidebar Footer Logout action area */}
        <div className="p-4 border-t border-slate-800">
          <button 
  onClick={handleLogout}
  className="w-full text-left px-4 py-3 rounded-xl font-semibold text-sm text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
>
  Terminate Session
</button>

        </div>
      </aside>

      {/* =========================================================
          RIGHT CONTENT VIEW WRAPPER CANVAS AREA 
         ========================================================= */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        
        {/* TOP NAVBAR HEADER COMPONENT */}
        <header className="sticky top-0 z-10 w-full h-20 bg-white border-b border-slate-200 px-8 flex justify-between items-center shadow-sm">
  <h1 className="text-xl font-bold text-slate-800 tracking-tight">IT Service Management Console</h1>

          
          {/* Core account metadata user capsule badge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800 leading-tight">{currentUser.name}</p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{currentUser.role}</p>
            </div>
          </div>
        </header>

        {/* MAIN ROUTED VIEW WORKSPACE LAYOUT */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
  {activeTab === 'New Ticket' ? (
    <div className="max-w-2xl mx-auto pt-6">
      <CreateTicket />
    </div>
  ) : activeTab === 'Manage Users' ? (
    <UserManagement />
  ) : (
    <div className="space-y-8">
      {/* Unlocked for everyone! The backend will safely filter row views automatically */}
      <TicketList currentUser={currentUser} />
    </div>
  )}
</main>


      </div>

    </div>
  );
}

export default App;
