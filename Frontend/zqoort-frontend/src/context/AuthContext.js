import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { authAPI } from '../api/auth';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (token) {
          const { data } = await authAPI.getMe();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        authAPI.logout();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      toast.success('✅ تم تسجيل الدخول بنجاح');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تسجيل الدخول');
      return false;
    }
  };

  const register = async (data) => {
    try {
      const {  res } = await authAPI.register(data);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      toast.success('✅ تم إنشاء الحساب بنجاح');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل التسجيل');
      return false;
    }
  };

  const logout = () => {
    authAPI.logout();
    setToken(null);
    setUser(null);
    toast.info('👋 تم تسجيل الخروج');
  };

  const value = useMemo(() => ({
    user, token, loading, login, register, logout, isAuthenticated: !!token
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};