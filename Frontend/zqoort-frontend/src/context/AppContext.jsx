import { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = { theme: 'light', notifications: [], sidebarOpen: true };
function appReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME': return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'ADD_NOTIFICATION': return { ...state, notifications: [...state.notifications, { id: Date.now(), ...action.payload }] };
    case 'REMOVE_NOTIFICATION': return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'TOGGLE_SIDEBAR': return { ...state, sidebarOpen: !state.sidebarOpen };
    default: return state;
  }
}

const AppContext = createContext(null);
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  useEffect(() => { document.documentElement.className = state.theme; }, [state.theme]);
  useEffect(() => { if (!state.notifications.length) return; const timers = state.notifications.map(n => setTimeout(() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: n.id }), 5000)); return () => timers.forEach(clearTimeout); }, [state.notifications]);
  const value = { ...state, toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }), addNotification: (n) => dispatch({ type: 'ADD_NOTIFICATION', payload: n }), toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }) };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export const useApp = () => { const ctx = useContext(AppContext); if (!ctx) throw new Error('useApp inside Provider'); return ctx; };