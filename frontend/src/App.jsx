import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import CreateTicket from './pages/CreateTicket';
import TicketList from './pages/TicketList';
import Auth from './pages/Auth';
import Landing from './pages/Landing'; 
import UserManagement from './pages/UserManagement';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

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

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Verifying system session...</p>;

  if (!currentUser) {
  // Handle reset password link from email
  if (window.location.search.includes('token=')) {
    return (
      <>
        <Toaster position="top-right" />
        <ResetPassword onBackToLogin={() => {
          window.history.pushState({}, '', '/');
          setShowLogin(true);
        }} />
      </>
    );
  }

  if (showLogin) {
    return (
      <>
        <Toaster position="top-right" />
        <Auth
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setShowLogin(false);
          }}
          onCancelAuth={() => setShowLogin(false)}
          onForgotPassword={() => setShowLogin('forgot')}
        />
      </>
    );
  }

  if (showLogin === 'forgot') {
    return (
      <>
        <Toaster position="top-right" />
        <ForgotPassword onBackToLogin={() => setShowLogin(true)} />
      </>
    );
  }

  return <Landing onNavigateToLogin={() => setShowLogin(true)} />;
}

  return (
    <div className="flex w-full min-h-screen bg-[#F8FAFC] font-sans antialiased text-[#1E293B]">
      
      {/* Toast Notification Container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E293B',
            color: '#fff',
            fontWeight: '600',
            fontSize: '13px',
            borderRadius: '12px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#22C55E', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
          },
        }}
      />

      {/* LEFT SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-20 w-64 bg-slate-900 text-slate-400 flex flex-col border-r border-slate-800 shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <img src="/logo.png" alt="Myhelpdesk Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-white tracking-tight">Myhelpdesk</span>
        </div>

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

          {currentUser.role === 'admin' && (
            <button 
              onClick={() => setActiveTab('Manage Users')}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'Manage Users' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-slate-200'}`}
            >
              Manage Accounts Directory
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-xl font-semibold text-sm text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
          >
            Terminate Session
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 w-full h-20 bg-white border-b border-slate-200 px-8 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">IT Service Management Console</h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800 leading-tight">{currentUser.name}</p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{currentUser.role}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'New Ticket' ? (
            <div className="max-w-2xl mx-auto pt-6">
              <CreateTicket />
            </div>
          ) : activeTab === 'Manage Users' ? (
            <UserManagement />
          ) : (
            <div className="space-y-8">
              <TicketList currentUser={currentUser} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;