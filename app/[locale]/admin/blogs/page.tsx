'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api/admin';
import Link from 'next/link';
import { AlertTriangle, X, Plus, Calendar, Settings, Trash2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const SUPPORTED_LOCALES = ['en', 'hi', 'pt', 'es', 'id', 'de', 'fr', 'ja', 'ru', 'tr', 'it', 'ko', 'zh', 'ar'];

export default function AdminBlogsDashboard({ params: { locale } }: { params: { locale: string } }) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, slug: string | null}>({isOpen: false, slug: null});
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await adminApi.getBlogs(locale);
      setBlogs(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push(`/${locale}/admin/login`);
      return;
    }
    fetchBlogs();
  }, [locale, router, fetchBlogs]);

  const openDeleteModal = (slug: string) => {
    setDeleteModal({ isOpen: true, slug });
  };

  const confirmDelete = async () => {
    if (!deleteModal.slug) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setIsDeleting(true);
    try {
      await adminApi.deleteBlog(locale, deleteModal.slug, token);
      fetchBlogs();
      setDeleteModal({ isOpen: false, slug: null });
    } catch (error) {
      alert('Failed to delete blog');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-slate-50">Loading...</div>;

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Dynamic Navigation Sidebar */}
        <AdminSidebar locale={locale} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 pt-20 lg:pt-10 lg:p-10 overflow-x-hidden">
          <div className="w-full space-y-8">
            
            {/* Header Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Blogs Management</h1>
                <div className="flex items-center gap-2.5 mt-2">
                  <span className="text-sm font-semibold text-slate-500">Managing Locale:</span>
                  <select
                    value={locale}
                    onChange={(e) => router.push(`/${e.target.value}/admin/blogs`)}
                    className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl focus:ring-orange-500 focus:border-orange-500 p-2 transition-all"
                  >
                    {SUPPORTED_LOCALES.map((l) => (
                      <option key={l} value={l}>{l.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <Link href={`/${locale}/admin/blogs/new`} className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-orange-600/15 uppercase tracking-wider text-center flex items-center gap-2">
                  <Plus size={16} /> Create New Blog
                </Link>
              </div>
            </div>

            {/* Table Container */}
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-400 uppercase tracking-widest">Title</th>
                      <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-400 uppercase tracking-widest">Slug</th>
                      <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-right text-xs font-extrabold text-slate-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {blogs.map((blog) => (
                      <tr key={blog._id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 max-w-sm whitespace-normal break-words">{blog.title}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-550 font-mono">{blog.slug}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-slate-400" />
                            <span>{new Date(blog.createdAt).toLocaleDateString(locale, { dateStyle: 'medium' })}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <Link href={`/${locale}/admin/blogs/edit/${blog.slug}`} className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-extrabold hover:bg-slate-50 text-orange-600 transition-all uppercase tracking-wider inline-block">
                              Edit
                            </Link>
                            <button 
                              onClick={() => openDeleteModal(blog.slug)} 
                              className="px-3 py-1.5 border border-transparent rounded-lg text-xs font-extrabold text-rose-600 hover:bg-rose-50 transition-all uppercase tracking-wider inline-block"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {blogs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-450 font-medium">
                          No blogs found in this language. Click "Create New Blog" to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card List View */}
            <div className="block md:hidden space-y-4">
              {blogs.map((blog) => (
                <div key={blog._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{blog.title}</h3>
                    <p className="text-xs text-slate-500 font-mono break-all">{blog.slug}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{new Date(blog.createdAt).toLocaleDateString(locale, { dateStyle: 'medium' })}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link 
                        href={`/${locale}/admin/blogs/edit/${blog.slug}`} 
                        className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-extrabold text-orange-600 hover:bg-slate-50 transition-all uppercase tracking-wider"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => openDeleteModal(blog.slug)} 
                        className="px-3 py-1.5 border border-transparent rounded-lg text-xs font-extrabold text-rose-600 hover:bg-rose-50 transition-all uppercase tracking-wider"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && (
                <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 shadow-sm text-slate-450 font-medium text-sm">
                  No blogs found in this language. Click "Create New Blog" to get started!
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Delete Blog</h3>
                  <p className="text-sm text-slate-500 mt-1">This action cannot be undone.</p>
                </div>
              </div>
              <button
                onClick={() => setDeleteModal({ isOpen: false, slug: null })}
                className="text-slate-400 hover:text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, slug: null })}
                className="px-4 py-2 font-medium text-slate-700 bg-white border border-slate-350 border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Blog'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
