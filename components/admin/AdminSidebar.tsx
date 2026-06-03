'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Mail, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { adminApi } from '@/lib/api/admin';

interface AdminSidebarProps {
  locale: string;
}

export default function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: 'SEO Dashboard',
      href: `/${locale}/admin/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: 'Blogs Management',
      href: `/${locale}/admin/blogs`,
      icon: BookOpen,
    },
    {
      name: 'Contact Messages',
      href: `/${locale}/admin/contacts`,
      icon: Mail,
    },
  ];

  const handleLogout = async () => {
    localStorage.removeItem('adminToken');
    try {
      await adminApi.logout();
    } catch (e) {
      console.error(e);
    }
    router.push(`/${locale}/admin/login`);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-slate-900 border-b border-slate-800 z-40 flex items-center justify-between px-4 shadow-md">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white focus:outline-none transition-all"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link href={`/${locale}/admin/dashboard`} className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-black text-white text-xs">
            A
          </span>
          <span className="font-extrabold text-xs tracking-wider uppercase text-white">Aynzo Admin</span>
        </Link>
        <div className="w-9" /> {/* Spacer for symmetry */}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-45 transition-opacity duration-300"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/40">
          <Link href={`/${locale}/admin/dashboard`} className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-black text-white shadow-lg shadow-orange-500/25">
              A
            </span>
            <div>
              <span className="font-extrabold text-sm tracking-wider uppercase text-white block">Aynzo Admin</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Management Suite</span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all group
                  ${isActive 
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/10' 
                    : 'text-slate-350 hover:bg-slate-850 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />
                  <span>{item.name}</span>
                </div>
                <ChevronRight 
                  size={14} 
                  className={`transition-transform ${isActive ? 'rotate-90 text-white' : 'text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-350'}`} 
                />
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 space-y-1.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-850 hover:text-white transition-all"
          >
            <ExternalLink size={18} />
            <span>View Live Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-450 hover:bg-rose-950/20 hover:text-rose-400 transition-all text-left"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
