const BASE_URL = '/api';

export const adminApi = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Logout failed');
    return res.json();
  },

  getSEOList: async (locale: string, token: string, page = 1, limit = 50, search = '', category = '') => {
    const res = await fetch(`${BASE_URL}/seo/list/${locale}?page=${page}&limit=${limit}&search=${search}&category=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch SEO data');
    return res.json();
  },

  updateSEO: async (locale: string, slug: string, data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/seo/${locale}/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update SEO');
    return res.json();
  },

  getBlogs: async (locale: string, page = 1) => {
    const res = await fetch(`${BASE_URL}/blog/${locale}?page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  },

  createBlog: async (locale: string, data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/blog/${locale}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create blog');
    return res.json();
  },

  updateBlog: async (locale: string, slug: string, data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/blog/${locale}/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update blog');
    return res.json();
  },

  deleteBlog: async (locale: string, slug: string, token: string) => {
    const res = await fetch(`${BASE_URL}/blog/${locale}/${slug}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete blog');
    return res.json();
  },
};
