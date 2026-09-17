export const API_BASE = 'http://localhost:8080/api';

const adminHeaders = (email, key) => ({
  'X-Admin-Email': email,
  'X-Admin-Key': key,
});

// TODO: Replace these with your actual Cloudinary details!
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME';
const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';

export const uploadImageToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Backend upload failed');
    const data = await res.json();
    return data.url;
  } catch (err) {
    console.warn("Backend image upload failed, falling back to local reader", err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = ev => resolve(ev.target?.result);
      reader.readAsDataURL(file);
    });
  }
};

export const api = {
  getProducts: async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (e) {
      console.error("Failed to fetch products:", e);
      return null;
    }
  },
  
  createProduct: async (product) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      return await res.json();
    } catch (e) {
      console.error("Failed to create product:", e);
      return null;
    }
  },

  deleteProduct: async (id) => {
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error("Failed to delete product:", e);
    }
  },

  syncUser: async (user) => {
    const res = await fetch(`${API_BASE}/users/sync`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user)
    });
    return res.ok ? res.json() : null;
  },

  saveChat: async (chat) => {
    const res = await fetch(`${API_BASE}/users/chats`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(chat)
    });
    return res.ok ? res.json() : null;
  },

  adminOverview: async (email, key) => {
    const res = await fetch(`${API_BASE}/admin/overview`, { headers: adminHeaders(email, key) });
    if (!res.ok) throw new Error('Admin authorization failed');
    return res.json();
  },

  adminCreateProduct: async (email, key, product) => {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST', headers: { ...adminHeaders(email, key), 'Content-Type': 'application/json' }, body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Could not create product');
    return res.json();
  },

  adminDeleteProduct: async (email, key, id) => {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, { method: 'DELETE', headers: adminHeaders(email, key) });
    if (!res.ok) throw new Error('Could not delete product');
  },
  
  getActivities: async () => {
    try {
      const res = await fetch(`${API_BASE}/activities`);
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (e) {
      console.error("Failed to fetch activities:", e);
      return null;
    }
  },

  createActivity: async (activity) => {
    try {
      const res = await fetch(`${API_BASE}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });
      return await res.json();
    } catch (e) {
      console.error("Failed to create activity:", e);
    }
  },

  deleteActivity: async (id) => {
    try {
      await fetch(`${API_BASE}/activities/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error("Failed to delete activity:", e);
    }
  },

  clearActivities: async () => {
    try {
      await fetch(`${API_BASE}/activities`, { method: 'DELETE' });
    } catch (e) {
      console.error("Failed to clear activities:", e);
    }
  },

  createOrder: async (orderData) => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await res.json();
    } catch (e) {
      console.error("Failed to process order:", e);
      return null;
    }
  }
};
