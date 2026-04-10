import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { apiService } from '../api/axios';

const initialState = { user: null, token: localStorage.getItem('token'), refreshToken: localStorage.getItem('refreshToken'), isAuthenticated: !!localStorage.getItem('token'), loading: false, error: null, userRole: null, permissions: [], isVerified: false };

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START': return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      if (action.payload.refreshToken) localStorage.setItem('refreshToken', action.payload.refreshToken);
      return { ...state, loading: false, user: action.payload.user, token: action.payload.token, refreshToken: action.payload.refreshToken, isAuthenticated: true, userRole: action.payload.meta?.role, permissions: action.payload.meta?.permissions || [], isVerified: action.payload.meta?.isVerified, error: null };
    case 'LOGIN_ERROR': return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT': localStorage.removeItem('token'); localStorage.removeItem('refreshToken'); return { ...initialState };
    case 'CLEAR_ERROR': return { ...state, error: null };
    default: return state;
  }
}

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const login = useCallback(async (email, password) => { dispatch({ type: 'LOGIN_START' }); try { const res = await apiService.post('/auth/login', { email, password }); dispatch({ type: 'LOGIN_SUCCESS', payload: res }); return { success: true }; } catch (e) { dispatch({ type: 'LOGIN_ERROR', payload: e.response?.data?.message || 'فشل تسجيل الدخول' }); return { success: false }; } }, []);
  const register = useCallback(async (data) => { dispatch({ type: 'LOGIN_START' }); try { const res = await apiService.post('/auth/register', data); dispatch({ type: 'LOGIN_SUCCESS', payload: res }); return { success: true }; } catch (e) { dispatch({ type: 'LOGIN_ERROR', payload: e.response?.data?.message || 'فشل التسجيل' }); return { success: false }; } }, []);
  const logout = useCallback(async () => { try { await apiService.post('/auth/logout'); } catch {} dispatch({ type: 'LOGOUT' }); }, []);
  return <AuthContext.Provider value={{ ...state, login, register, logout, clearError: () => dispatch({ type: 'CLEAR_ERROR' }) }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth inside Provider'); return ctx; };