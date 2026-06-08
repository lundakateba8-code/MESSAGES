const Storage = {
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  get(key) { const item = localStorage.getItem(key); return item ? JSON.parse(item) : null; },
  remove(key) { localStorage.removeItem(key); },
  clear() { localStorage.clear(); }
};

const Auth = {
  getToken() { return Storage.get(CONFIG.TOKEN_KEY); },
  setToken(token) { Storage.set(CONFIG.TOKEN_KEY, token); },
  getUser() { return Storage.get(CONFIG.USER_KEY); },
  setUser(user) { Storage.set(CONFIG.USER_KEY, user); },
  isAuthenticated() { return !!this.getToken(); },
  logout() { Storage.remove(CONFIG.TOKEN_KEY); Storage.remove(CONFIG.USER_KEY); window.location.href = 'auth.html'; }
};

const API = {
  async request(endpoint, options = {}) {
    const token = Auth.getToken();
    const headers = { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) };
    if (options.body instanceof FormData) delete headers['Content-Type'];
    const response = await fetch(`${CONFIG.API_URL}${endpoint}`, { ...options, headers: { ...headers, ...options.headers } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur');
    return data;
  },
  get(endpoint) { return this.request(endpoint); },
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); },
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); },
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); },
  upload(endpoint, formData) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `${CONFIG.API_URL}${endpoint}`);
      xhr.setRequestHeader('Authorization', `Bearer ${Auth.getToken()}`);
      xhr.onload = () => resolve(JSON.parse(xhr.responseText));
      xhr.onerror = () => reject(new Error('Erreur réseau'));
      xhr.send(formData);
    });
  }
};

const Format = {
  time(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },
  fileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  date(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
};