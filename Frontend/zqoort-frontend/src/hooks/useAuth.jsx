import { useAuth as useAuthContext } from '../context/AuthContext';

// Re-export for convenience
export { useAuthContext as useAuth };

// Custom hook with additional logic if needed
export function useAuthWithRedirect() {
  const auth = useAuthContext();
  
  const requireAuth = (callback) => {
    if (!auth.isAuthenticated) {
      // Redirect to login
      window.location.href = '/login';
      return false;
    }
    return callback();
  };
  
  return { ...auth, requireAuth };
}