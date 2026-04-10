import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

export default function ProtectedRoute({ children, allowedRoles = [], requiredPermissions = [] }) {
  const { isAuthenticated, userRole, permissions, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingSpinner className="min-h-screen" />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles.length && !allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" replace />;
  if (requiredPermissions.length && !requiredPermissions.every(p => permissions.includes(p) || permissions.includes('*'))) return <Navigate to="/unauthorized" replace />;
  return children;
}