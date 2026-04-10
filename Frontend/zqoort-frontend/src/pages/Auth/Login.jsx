import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const { addNotification } = useApp();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); clearError(); setLoading(true);
    const res = await login(email, password); setLoading(false);
    if (res.success) { addNotification({ type: 'success', message: 'تم الدخول بنجاح' }); navigate('/map'); }
    else addNotification({ type: 'error', message: res.error });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <div className="text-center"><div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🗺️</div><h1 className="text-2xl font-bold">مرحباً بعودتك</h1><p className="text-gray-600">سجل الدخول للمتابعة</p></div>
        <Input label="البريد الإلكتروني" type="email" placeholder="example@email.com" value={email} onChange={e => setEmail(e.target.value)} icon={Mail} required />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">كلمة المرور</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="••••••••" required />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
          </div>
        </div>
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
        <Button type="submit" className="w-full" loading={loading}>{loading ? 'جاري الدخول...' : 'تسجيل الدخول'}</Button>
        <div className="text-center text-sm text-gray-600">ليس لديك حساب؟ <Link to="/register" className="text-blue-600 font-medium hover:underline">إنشاء حساب</Link></div>
      </form>
    </div>
  );
}