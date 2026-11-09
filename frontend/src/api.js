const API = import.meta.env.VITE_API_URL || '/api';
const ASSET = import.meta.env.VITE_ASSET_URL || '';

export const getToken = () => localStorage.getItem('op_token');
export const setToken = (t) => (t ? localStorage.setItem('op_token', t) : localStorage.removeItem('op_token'));

// Prefix locally-uploaded images when API lives on another domain
export const assetUrl = (u) => (u && u.startsWith('/uploads') ? ASSET + u : u);

async function request(method, path, body) {
  const headers = {};
  const isForm = body instanceof FormData;
  if (body && !isForm) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(API + path, { method, headers, body: body ? (isForm ? body : JSON.stringify(body)) : undefined });
  } catch {
    throw new Error('Cannot reach the server. Please try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (p) => request('GET', p),
  post: (p, b) => request('POST', p, b),
  put: (p, b) => request('PUT', p, b),
  patch: (p, b) => request('PATCH', p, b),
  del: (p) => request('DELETE', p),
  upload: async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return (await request('POST', '/upload', fd)).url;
  },
};
