import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { AppProvider } from './context/AppContext';
import Login from '../pages/auth/Login';
import MapPage from './pages/map/MapPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/map" replace />} />
        <Route path="/map" element={<ProtectedRoute allowedRoles={['help_seeker', 'helper', 'organization', 'admin']}><MapPage /></ProtectedRoute>} />
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold text-gray-500">404 - صفحة غير موجودة</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </AppProvider>
  );
}