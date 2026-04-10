import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useSocket } from '../../context/SocketContext';
import { Bell, Moon, Sun, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, toggleSidebar } = useApp();
  const { isConnected } = useSocket();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"><Menu className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🗺️ Plattform</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} /> {isConnected ? 'متصل' : 'غير متصل'}
        </div>
        <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 rounded-lg">{theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}</button>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">{user?.name?.charAt(0) || 'U'}</div>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-1">
              <button onClick={logout} className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><LogOut className="w-4 h-4" /> تسجيل الخروج</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}