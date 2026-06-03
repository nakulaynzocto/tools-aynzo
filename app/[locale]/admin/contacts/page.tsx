'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Mail, Calendar, User, MessageSquare, AlertCircle } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminContactsPage({ params: { locale } }: { params: { locale: string } }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchMessages = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push(`/${locale}/admin/login`);
      return;
    }

    try {
      const res = await fetch('/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(data.data || []);
      } else if (res.status === 401) {
        router.push(`/${locale}/admin/login`);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }, [locale, router]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setIsDeletingId(id);
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(prev => prev.filter(msg => msg._id !== id));
      } else {
        alert(data.message || 'Failed to delete message.');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Dynamic Navigation Sidebar */}
      <AdminSidebar locale={locale} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 pt-20 lg:pt-10 lg:p-10 overflow-x-hidden">
        <div className="w-full space-y-8">
          
          {/* Header Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Contact Messages</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                View and manage incoming queries and feedback from users.
              </p>
            </div>
            <div className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200/60 text-slate-700 text-xs font-bold uppercase tracking-wider self-start md:self-auto">
              Total Inbox: {messages.length} Messages
            </div>
          </div>

          {/* Messages List Container */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-sm text-slate-500 font-semibold animate-pulse">Fetching messages securely...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 border border-slate-200/50">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Inbox is empty</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                No users have submitted queries yet. New submissions will automatically appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {messages.map((msg) => (
                <div 
                  key={msg._id} 
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Sender Info Pane */}
                  <div className="md:w-72 bg-slate-50/50 p-6 border-b md:border-b-0 md:border-r border-slate-200/80 space-y-4 flex-shrink-0">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Sender</span>
                      <div className="flex items-center gap-2 text-slate-800">
                        <User size={16} className="text-orange-500" />
                        <span className="font-bold text-sm truncate">{msg.name}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Email Address</span>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={16} className="text-orange-500" />
                        <a href={`mailto:${msg.email}`} className="text-sm font-semibold truncate hover:underline hover:text-orange-600">
                          {msg.email}
                        </a>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Submitted On</span>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={16} className="text-orange-500" />
                        <span className="text-xs font-semibold">
                          {new Date(msg.createdAt).toLocaleString(locale, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message Body Pane */}
                  <div className="flex-1 p-6 flex flex-col justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-slate-400" />
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                          Subject: <span className="text-orange-600 font-bold normal-case">{msg.subject}</span>
                        </h4>
                      </div>
                      <p className="text-slate-650 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex justify-end border-t border-slate-100 pt-4">
                      <button
                        onClick={() => handleDelete(msg._id)}
                        disabled={isDeletingId === msg._id}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Trash2 size={14} />
                        {isDeletingId === msg._id ? 'Deleting...' : 'Delete Message'}
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
