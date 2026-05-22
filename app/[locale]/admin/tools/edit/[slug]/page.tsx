'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api/admin';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditToolSEOPage({ params: { locale, slug } }: { params: { locale: string, slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  
  const [formData, setFormData] = useState({
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[],
    pageH1: '',
    contentBody: '',
    faq: [] as {question: string, answer: string}[],
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push(`/${locale}/admin/login`);
      return;
    }

    const fetchToolData = async () => {
      try {
        const response = await fetch(`/api/seo/${locale}/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch tool SEO');
        const data = await response.json();
        
        setFormData({
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          seoKeywords: data.seoKeywords || [],
          pageH1: data.pageH1 || '',
          contentBody: data.contentBody || '',
          faq: data.faq || [],
        });
      } catch (err) {
        alert('Error loading tool SEO data');
      } finally {
        setLoading(false);
      }
    };
    fetchToolData();
  }, [locale, slug]);

  const handleAddFaq = () => {
    setFormData({ ...formData, faq: [...formData.faq, { question: '', answer: '' }] });
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaq = [...formData.faq];
    newFaq[index][field] = value;
    setFormData({ ...formData, faq: newFaq });
  };

  const handleRemoveFaq = (index: number) => {
    setFormData({ ...formData, faq: formData.faq.filter((_, i) => i !== index) });
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = keywordInput.trim();
      if (val && !formData.seoKeywords.includes(val)) {
        setFormData({ ...formData, seoKeywords: [...formData.seoKeywords, val] });
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (kwToRemove: string) => {
    setFormData({ ...formData, seoKeywords: formData.seoKeywords.filter(k => k !== kwToRemove) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setSaving(false);
      router.push(`/${locale}/admin/login`);
      return;
    }

    try {
      await adminApi.updateSEO(locale, slug, {
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
        pageH1: formData.pageH1,
        contentBody: formData.contentBody,
        faq: formData.faq.filter(f => f.question.trim() && f.answer.trim()),
      }, token);
      router.push(`/${locale}/admin/dashboard`);
    } catch (error) {
      alert('Failed to save SEO data');
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500 font-medium animate-pulse">Loading SEO Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Sticky Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 backdrop-blur-md p-4 sm:p-6 rounded-[2rem] border border-white/60 shadow-sm shadow-gray-200/20 sticky top-4 z-50">
            <div className="flex items-center gap-4">
                <button 
                    type="button"
                    className="p-2 hover:bg-white rounded-full transition-colors" 
                    onClick={() => router.push(`/${locale}/admin/dashboard`)}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <div className="space-y-0.5">
                    <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                        Edit Tool SEO
                    </h1>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        {slug} • {locale}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    type="button"
                    className="px-6 h-10 rounded-lg font-semibold uppercase tracking-widest text-[10px] text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                    onClick={() => router.push(`/${locale}/admin/dashboard`)}
                >
                    Discard
                </button>
                <button 
                    type="submit"
                    form="seo-form"
                    disabled={saving}
                    className="px-6 h-10 rounded-lg font-bold uppercase tracking-widest text-[11px] shadow-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Update SEO'}
                </button>
            </div>
        </div>

        <form id="seo-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Primary Content Section */}
            <section className="space-y-6">
                <div className="space-y-1 ml-2">
                    <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">Primary Content</h2>
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest">Main content visible on the tool page</p>
                </div>
                
                <div className="rounded-[2rem] border-none bg-white shadow-sm shadow-gray-200/30 p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Page H1 Heading <span className="text-rose-500">*</span></label>
                        <input 
                            type="text"
                            value={formData.pageH1} 
                            onChange={(e) => setFormData({ ...formData, pageH1: e.target.value })} 
                            placeholder="Enter the main H1 heading..."
                            className="w-full rounded-xl border border-gray-200 bg-white hover:bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg font-bold px-4 py-3 outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                            Content Body
                        </label>
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                            <ReactQuill 
                                theme="snow"
                                value={formData.contentBody} 
                                onChange={(val) => setFormData({ ...formData, contentBody: val })} 
                                className="border-none"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="space-y-6 pt-4">
                <div className="flex items-center gap-3 ml-2">
                    <div className="h-8 w-1 bg-[#3882a5] rounded-full" />
                    <h3 className="text-xs font-black uppercase text-gray-800 tracking-[0.2em]">Rich Snippets (FAQ)</h3>
                </div>

                <div className="rounded-[2rem] border-none bg-white shadow-sm shadow-gray-200/30 p-8 sm:p-10 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[11px] font-bold text-gray-400 max-w-xs leading-relaxed">
                            Boost your SEO rankings by adding frequently asked questions. These appear as rich results in Google.
                        </p>
                        <button 
                            type="button" 
                            className="h-10 px-4 rounded-lg border border-gray-200 text-gray-700 font-semibold text-xs transition-all shadow-sm hover:bg-gray-50 flex items-center gap-2"
                            onClick={handleAddFaq}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Add FAQ
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {formData.faq.map((f, i) => (
                            <div key={i} className="p-6 rounded-[1.8rem] bg-gray-50/50 border border-gray-100 space-y-4 relative group">
                                <button 
                                    type="button" 
                                    className="absolute top-4 right-4 h-8 w-8 text-red-400 hover:text-red-600 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors"
                                    onClick={() => handleRemoveFaq(i)}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                                
                                <div className="flex gap-4 items-start">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-black text-gray-700 text-xs border border-gray-100 shadow-sm">
                                        Q{i + 1}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <input 
                                            type="text"
                                            value={f.question} 
                                            onChange={(e) => handleFaqChange(i, 'question', e.target.value)} 
                                            placeholder="e.g. What is this tool?" 
                                            className="w-full h-10 px-4 rounded-xl border border-gray-200 bg-white shadow-sm font-semibold text-sm focus:border-blue-500 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
                                        />
                                        <textarea 
                                            value={f.answer} 
                                            onChange={(e) => handleFaqChange(i, 'answer', e.target.value)} 
                                            placeholder="e.g. This tool allows you to..." 
                                            className="w-full rounded-xl border border-gray-200 bg-white shadow-sm p-4 text-sm font-medium min-h-[70px] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none" 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {formData.faq.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/30">
                                <svg className="h-8 w-8 text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Add FAQs for SEO optimization</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
          </div>

          {/* Sidebar / Right Column */}
          <div className="space-y-8">
            <section className="space-y-6">
                <div className="flex items-center gap-3 ml-2">
                    <div className="h-8 w-1 bg-blue-500 rounded-full" />
                    <h3 className="text-xs font-black uppercase text-gray-800 tracking-[0.2em]">SEO Engine</h3>
                </div>

                <div className="rounded-[2rem] border-none bg-white shadow-sm shadow-gray-200/30 overflow-hidden">
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Meta Title</label>
                            <textarea 
                                value={formData.seoTitle} 
                                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} 
                                placeholder="Keyword-rich title"
                                className="w-full bg-white border-2 border-gray-100 p-4 min-h-[80px] rounded-xl font-bold focus:border-blue-500/50 outline-none transition-all resize-none text-[13px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Meta Description</label>
                            <textarea 
                                value={formData.seoDescription} 
                                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} 
                                placeholder="SERP search result snippet..." 
                                className="w-full rounded-xl border-2 border-gray-100 bg-white p-4 min-h-[120px] text-[13px] font-bold focus:border-blue-500/50 transition-all outline-none resize-none" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Focus Keywords</label>
                            <input 
                                type="text"
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyDown={handleKeywordKeyDown}
                                placeholder="Type a keyword and press Enter or Comma..."
                                className="w-full bg-white border-2 border-gray-100 p-4 rounded-xl font-bold focus:border-blue-500/50 outline-none transition-all text-[13px]"
                            />
                            {formData.seoKeywords.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100 min-h-[60px]">
                                    {formData.seoKeywords.map((kw, i) => (
                                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 shadow-sm transition-all hover:shadow-md">
                                            {kw}
                                            <button 
                                                type="button" 
                                                onClick={() => removeKeyword(kw)}
                                                className="hover:text-blue-900 transition-colors bg-blue-100/50 hover:bg-blue-200 rounded-md p-0.5 focus:outline-none"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100/50 space-y-4 mt-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Visibility</span>
                                </div>
                                <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest px-2 py-1 bg-emerald-50 rounded border border-emerald-100">
                                    Indexed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}
