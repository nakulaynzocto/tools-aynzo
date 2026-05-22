'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api/admin';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function NewBlogPage({ params: { locale } }: { params: { locale: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    category: 'Guide',
    readTime: '5 min read',
    internalLink: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push(`/${locale}/admin/login`);
    }
  }, [locale, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      router.push(`/${locale}/admin/login`);
      return;
    }

    try {
      await adminApi.createBlog(locale, {
        ...formData,
        seoKeywords: formData.seoKeywords.split(',').map(k => k.trim()).filter(Boolean),
      }, token);
      router.push(`/${locale}/admin/blogs`);
    } catch (error) {
      alert('Failed to create blog');
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Blog ({locale.toUpperCase()})</h1>
          <Link href={`/${locale}/admin/blogs`} className="text-gray-500 hover:text-gray-700">Cancel</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title</label>
              <input 
                required
                type="text"
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })} 
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
              <input 
                required
                type="text"
                value={formData.slug} 
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
                className="w-full rounded border border-gray-300 px-3 py-2 bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blog Content</label>
            <ReactQuill 
              theme="snow"
              value={formData.content} 
              onChange={(val) => setFormData({ ...formData, content: val })} 
              className="h-96 mb-12"
            />
          </div>

          <div className="pt-4 border-t grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input 
                type="text"
                placeholder="e.g. Image Tools"
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
              <input 
                type="text"
                placeholder="e.g. 5 min read"
                value={formData.readTime} 
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })} 
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal Link (Optional)</label>
              <input 
                type="text"
                placeholder="e.g. https://tools.aynzo.com/en/tools/image-compressor"
                value={formData.internalLink} 
                onChange={(e) => setFormData({ ...formData, internalLink: e.target.value })} 
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="pt-8 border-t space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">SEO Settings & Optimization</h3>
              <p className="text-sm text-gray-500">Manage how your blog appears in search engine results.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Inputs */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-sm font-semibold text-gray-700">SEO Title (Meta Title)</label>
                    <span className={`text-xs font-medium ${formData.seoTitle.length > 60 ? 'text-red-500' : formData.seoTitle.length > 40 ? 'text-green-600' : 'text-gray-400'}`}>
                      {formData.seoTitle.length} / 60
                    </span>
                  </div>
                  <input 
                    type="text"
                    value={formData.seoTitle} 
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} 
                    placeholder="Enter SEO optimized title"
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Ideally between 50 to 60 characters for best visibility.</p>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-sm font-semibold text-gray-700">Meta Description</label>
                    <span className={`text-xs font-medium ${formData.seoDescription.length > 160 ? 'text-red-500' : formData.seoDescription.length > 120 ? 'text-green-600' : 'text-gray-400'}`}>
                      {formData.seoDescription.length} / 160
                    </span>
                  </div>
                  <textarea 
                    value={formData.seoDescription} 
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} 
                    rows={4}
                    placeholder="Write a compelling description that encourages clicks..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Recommended length is 150-160 characters.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Focus Keywords</label>
                  <input 
                    type="text"
                    value={formData.seoKeywords} 
                    onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })} 
                    placeholder="e.g. tools, online editor, free software"
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Separate multiple keywords with commas.</p>
                </div>
              </div>

              {/* Right Column: Google Preview */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.24 10.285V14.4h6.806c-.275 1.565-1.06 2.842-2.126 3.909-1.295 1.295-3.23 2.762-6.526 2.762-5.21 0-9.43-4.32-9.43-9.53 0-5.21 4.22-9.53 9.43-9.53 3.14 0 5.378 1.206 6.945 2.684l3.056-3.056C17.79 1.15 15.225 0 12.24 0 5.485 0 0 5.485 0 12.24c0 6.755 5.485 12.24 12.24 12.24 7.07 0 11.755-4.966 11.755-11.966 0-.82-.075-1.46-.215-2.228H12.24z"/></svg>
                  Search Engine Preview
                </h4>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 max-w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">A</div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 leading-tight">Aynzo Tools</div>
                      <div className="text-[11px] text-gray-600 leading-tight">https://tools.aynzo.com/{locale}/blog/{formData.slug || 'your-slug-here'}</div>
                    </div>
                  </div>
                  <h5 className="text-[18px] text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug mb-1 truncate">
                    {formData.seoTitle || formData.title || 'Please enter an SEO title'}
                  </h5>
                  <p className="text-[13px] text-[#4d5156] leading-snug line-clamp-2">
                    {formData.seoDescription || 'Your meta description will appear here. Write something descriptive that will encourage users to click through to your article.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Publishing...' : 'Publish Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
