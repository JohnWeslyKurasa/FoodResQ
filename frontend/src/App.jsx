import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
import HowItWorksPage from './pages/HowItWorksPage';
import FoodListingsPage from './pages/FoodListingsPage';
import AuthModal from './components/AuthModal';
import SearchModal from './components/SearchModal';
import { Bell } from 'lucide-react';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppContent() {
  const { user } = useAuth();
  const { latestToast, setLatestToast } = useSocket();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [authDefaultRole, setAuthDefaultRole] = useState('donor');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleOpenAuth = (tab = 'login', role = 'donor') => {
    setAuthTab(tab);
    setAuthDefaultRole(role);
    setIsAuthOpen(true);
  };

  const handleNavigate = (viewId) => {
    const viewToRoute = {
      'home': '/',
      'how-it-works': '/how-it-works',
      'listings': '/listings',
      'organizations': '/organizations',
      'impact': '/impact',
      'about': '/about',
      'donor-dashboard': '/dashboard/donor',
      'ngo-dashboard': '/dashboard/ngo',
      'volunteer-dashboard': '/dashboard/volunteer',
      'admin-dashboard': '/dashboard/admin',
    };
    const route = viewToRoute[viewId] || '/';
    navigate(route);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Navigation Bar */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenAuth={() => handleOpenAuth('login')}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main View Display */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />} />
          <Route path="/how-it-works" element={<HowItWorksPage onOpenAuth={handleOpenAuth} />} />
          <Route path="/listings" element={<FoodListingsPage onOpenAuth={handleOpenAuth} onNavigate={handleNavigate} />} />
          <Route path="/organizations" element={<OrganizationsDirectory onOpenAuth={handleOpenAuth} />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/dashboard/donor"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DonorDashboard key={`donor-${user?._id || 'none'}`} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ngo"
            element={
              <ProtectedRoute allowedRoles={['recipient']}>
                <NgoDashboard key={`ngo-${user?._id || 'none'}`} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/volunteer"
            element={
              <ProtectedRoute allowedRoles={['volunteer']}>
                <VolunteerDashboard key={`volunteer-${user?._id || 'none'}`} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard key={`admin-${user?._id || 'none'}`} />
              </ProtectedRoute>
            }
          />
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
            donor: '/dashboard/donor',
            recipient: '/dashboard/ngo',
            volunteer: '/dashboard/volunteer',
            admin: '/dashboard/admin',
          };
          navigate(map[role] || '/');
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectListing={(listing) => {
          navigate('/listings');
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
