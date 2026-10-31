import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider, useSocket } from './context/SocketContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DonorDashboard from './pages/donor/DonorDashboard';
import NgoDashboard from './pages/ngo/NgoDashboard';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ImpactPage from './pages/impact/ImpactPage';
import OrganizationsDirectory from './pages/OrganizationsDirectory';
import AboutPage from './pages/AboutPage';
import AuthModal from './components/AuthModal';
import SearchModal from './components/SearchModal';
import { Bell, CheckCircle, Info } from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const { latestToast, setLatestToast } = useSocket();
  const [currentView, setCurrentView] = useState('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [authDefaultRole, setAuthDefaultRole] = useState('donor');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleOpenAuth = (tab = 'login', role = 'donor') => {
    setAuthTab(tab);
    setAuthDefaultRole(role);
    setIsAuthOpen(true);
  };

  // Sync view when user logs out from a dashboard
  React.useEffect(() => {
    if (!user) {
      if (['donor-dashboard', 'ngo-dashboard', 'volunteer-dashboard', 'admin-dashboard'].includes(currentView)) {
        setCurrentView('home');
      }
    }
  }, [user]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView} onOpenAuth={handleOpenAuth} />;
      case 'how-it-works':
        return <Home onNavigate={setCurrentView} onOpenAuth={handleOpenAuth} />;
      case 'listings':
        return <NgoDashboard key={`listings-${user?._id || 'guest'}`} />;
      case 'organizations':
        return <OrganizationsDirectory onOpenAuth={handleOpenAuth} />;
      case 'impact':
        return <ImpactPage />;
      case 'about':
        return <AboutPage />;
      case 'donor-dashboard':
        return <DonorDashboard key={`donor-${user?._id || 'none'}`} />;
      case 'ngo-dashboard':
        return <NgoDashboard key={`ngo-${user?._id || 'none'}`} />;
      case 'volunteer-dashboard':
        return <VolunteerDashboard key={`volunteer-${user?._id || 'none'}`} />;
      case 'admin-dashboard':
        return <AdminDashboard key={`admin-${user?._id || 'none'}`} />;
      default:
        return <Home onNavigate={setCurrentView} onOpenAuth={handleOpenAuth} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAuth={() => handleOpenAuth('login')}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main View Display */}
      <main style={{ flex: 1 }}>
        {renderCurrentView()}
      </main>

      {/* Real-Time Floating Toast Notification */}
      {latestToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--deep-forest-green)',
            color: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '400px',
            animation: 'modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            border: '1.5px solid var(--golden-yellow)',
          }}
        >
          <Bell size={22} color="var(--golden-yellow)" />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              {latestToast.title}
            </h4>
            <p style={{ fontSize: '0.8rem', margin: '2px 0 0', opacity: 0.9 }}>
              {latestToast.message}
            </p>
          </div>
          <button
            onClick={() => setLatestToast(null)}
            style={{ color: '#FFFFFF', opacity: 0.7, padding: '4px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
        defaultRole={authDefaultRole}
        onLoginSuccess={(role) => {
          const map = {
            donor: 'donor-dashboard',
            recipient: 'ngo-dashboard',
            volunteer: 'volunteer-dashboard',
            admin: 'admin-dashboard',
          };
          setCurrentView(map[role] || 'home');
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectListing={(listing) => {
          setCurrentView('listings');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </AuthProvider>
  );
}
