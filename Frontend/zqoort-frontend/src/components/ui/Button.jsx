import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export default function Button({ children, variant = 'primary', size = 'md', loading = false, className, icon: Icon, ...props }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const vars = { primary: 'bg-blue-600 hover:bg-blue-700 text-white', secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900', outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50', danger: 'bg-red-600 hover:bg-red-700 text-white' };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-base', lg: 'px-6 py-3 text-lg' };
  return <button className={twMerge(clsx(base, vars[variant], sizes[size], className))} disabled={loading || props.disabled} {...props}>{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{Icon && <Icon className="w-5 h-5 mr-2" />}{children}</>}</button>;
}