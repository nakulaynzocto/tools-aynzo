'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api/admin';
import Link from 'next/link';
import { useDebounce } from '../useDebounce';
import AdminSidebar from '@/components/admin/AdminSidebar';

const SUPPORTED_LOCALES = ['en', 'hi', 'pt', 'es', 'id', 'de', 'fr', 'ja', 'ru', 'tr', 'it', 'ko', 'zh', 'ar'];

export default function AdminDashboard({ params: { locale } }: { params: { locale: string } }) {
  const [seoData, setSeoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500); // 500ms delay
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchSEOData = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push(`/${locale}/admin/login`);
      return;
    }

    try {
      const response = await adminApi.getSEOList(locale, token, page, 10, debouncedSearch, category);
      setSeoData(response.data);
      setTotalPages(response.pages || 1);
    } catch (error) {
      console.error(error);
      router.push(`/${locale}/admin/login`);
    } finally {
      setLoading(false);
    }
  }, [locale, page, debouncedSearch, category, router]);

  useEffect(() => {
    fetchSEOData();
  }, [fetchSEOData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  if (loading) return <div className="flex justify-center items-center h-screen bg-slate-550">Loading...</div>;

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
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">SEO Dashboard</h1>
              <div className="flex items-center gap-2.5 mt-2">
                <span className="text-sm font-semibold text-slate-500">Managing Locale:</span>
                <select 
                  value={locale} 
                  onChange={(e) => router.push(`/${e.target.value}/admin/dashboard`)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl focus:ring-indigo-500 focus:border-indigo-500 p-2 transition-all"
                >
                  {SUPPORTED_LOCALES.map((l) => (
                    <option key={l} value={l}>{l.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link href={`/${locale}/admin/blogs/new`} className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-indigo-600/15 uppercase tracking-wider text-center">
                New Blog Post
              </Link>
            </div>
          </div>

          {/* Filtering controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
            <input 
              type="text"
              placeholder="Search tools by slug or title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-1/2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-orange-500 focus:outline-none transition-all"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full sm:w-1/2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold focus:border-orange-500 focus:outline-none transition-all"
            >
              <option value="">All Categories</option>
              <option value="image">Image Tools</option>
              <option value="pdf">PDF Tools</option>
              <option value="text">Text Tools</option>
              <option value="developer">Dev Tools</option>
              <option value="converter">Converters</option>
              <option value="utility">Utility Tools</option>
              <option value="security">Security Tools</option>
              <option value="crypto">Crypto Tools</option>
              <option value="youtube">YouTube Tools</option>
              <option value="seo">SEO Tools</option>
              <option value="social">Social & Links</option>
              <option value="calculator">Calculators</option>
            </select>
          </div>

          {/* Table Container */}
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-400 uppercase tracking-widest w-16">#</th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-400 uppercase tracking-widest">Tool Slug</th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-400 uppercase tracking-widest">SEO Title</th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-400 uppercase tracking-widest">Keywords</th>
                    <th className="px-6 py-4 text-right text-xs font-extrabold text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {seoData.map((tool, index) => (
                    <tr key={tool._id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-400">{(page - 1) * 10 + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{tool.toolSlug}</td>
                      <td className="px-6 py-4 text-sm text-slate-650 font-medium truncate max-w-xs">{tool.seoTitle}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <div className="flex flex-wrap gap-1">
                          {tool.seoKeywords?.slice(0, 3).map((kw: string, i: number) => (
                            <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-50 text-orange-700">
                              {kw}
                            </span>
                          ))}
                          {tool.seoKeywords?.length > 3 && <span className="text-xs font-bold text-slate-400">+{tool.seoKeywords.length - 3} more</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/${locale}/admin/tools/edit/${tool.toolSlug}`} className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-extrabold hover:bg-slate-50 text-orange-600 transition-all uppercase tracking-wider inline-block">
                          Edit SEO
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden space-y-4">
            {seoData.map((tool, index) => (
              <div key={tool._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-orange-600 tracking-wider">Tool Slug</span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{tool.toolSlug}</h3>
                  </div>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200/50">
                    {(page - 1) * 10 + index + 1}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">SEO Title</span>
                  <p className="text-sm text-slate-700 font-medium break-words leading-relaxed">{tool.seoTitle || "No Title Configured"}</p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">Keywords</span>
                  <div className="flex flex-wrap gap-1">
                    {tool.seoKeywords?.slice(0, 4).map((kw: string, i: number) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-orange-50 text-orange-700">
                        {kw}
                      </span>
                    ))}
                    {tool.seoKeywords?.length > 4 && (
                      <span className="text-[10px] font-bold text-slate-400 px-1 py-1">+{tool.seoKeywords.length - 4} more</span>
                    )}
                    {(!tool.seoKeywords || tool.seoKeywords.length === 0) && (
                      <span className="text-xs text-slate-400 italic">No keywords</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <Link 
                    href={`/${locale}/admin/tools/edit/${tool.toolSlug}`} 
                    className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-extrabold text-orange-600 hover:bg-slate-50 transition-all uppercase tracking-wider inline-block text-center"
                  >
                    Edit SEO
                  </Link>
                </div>
              </div>
            ))}
            {seoData.length === 0 && (
              <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 shadow-sm text-slate-450 font-medium text-sm">
                No tools match your criteria.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center">
                <p className="text-sm font-semibold text-slate-500">
                  Page <span className="font-bold text-slate-800">{page}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
