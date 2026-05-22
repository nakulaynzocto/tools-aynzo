'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api/admin';
import Link from 'next/link';

const SUPPORTED_LOCALES = ['en', 'hi', 'pt', 'es', 'id', 'de', 'fr', 'ja', 'ru', 'tr', 'it', 'ko', 'zh', 'ar'];

export default function AdminDashboard({ params: { locale } }: { params: { locale: string } }) {
  const [seoData, setSeoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
      const response = await adminApi.getSEOList(locale, token, page, 10, search, category);
      setSeoData(response.data);
      setTotalPages(response.pages || 1);
    } catch (error) {
      console.error(error);
      // Token expired or invalid — redirect to login
      router.push(`/${locale}/admin/login`);
    } finally {
      setLoading(false);
    }
  }, [locale, page, search, category, router]);

  useEffect(() => {
    fetchSEOData();
  }, [fetchSEOData]);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const handleLogout = async () => {
    localStorage.removeItem('adminToken');
    try {
      await adminApi.logout();
    } catch (e) {
      console.error(e);
    }
    router.push(`/${locale}/admin/login`);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SEO Dashboard</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-gray-500">Managing Locale:</p>
              <select 
                value={locale} 
                onChange={(e) => router.push(`/${e.target.value}/admin/dashboard`)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1"
              >
                {SUPPORTED_LOCALES.map((l) => (
                  <option key={l} value={l}>{l.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href={`/${locale}/admin/blogs`} className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 text-blue-600 border-blue-600">Manage Blogs</Link>
            <button className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50" onClick={() => router.push('/')}>View Site</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
          <input 
            type="text"
            placeholder="Search tools by slug or title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-1/4 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="image">Image Tools</option>
            <option value="convert">Converters</option>
            <option value="text">Text Tools</option>
            <option value="dev">Dev Tools</option>
            <option value="utility">Utility Tools</option>
            <option value="security">Security Tools</option>
            <option value="youtube">YouTube Tools</option>
            <option value="calculator">Calculators</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEO Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keywords</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {seoData.map((tool, index) => (
                <tr key={tool._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{(page - 1) * 10 + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tool.toolSlug}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{tool.seoTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {tool.seoKeywords?.slice(0, 3).map((kw: string, i: number) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {kw}
                        </span>
                      ))}
                      {tool.seoKeywords?.length > 3 && <span className="text-xs text-gray-400">+{tool.seoKeywords.length - 3} more</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/${locale}/admin/tools/edit/${tool.toolSlug}`} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 text-blue-600 transition-colors inline-block">
                      Edit SEO
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
