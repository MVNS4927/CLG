import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { nanoid } from '../utils/nanoid';
import { api } from '../utils/api';

const AppContext = createContext(null);

const defaultProducts = [];

const defaultUser = null;
const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);

const defaultActivity = [
  { id: 'a1', title: 'Joined CLG Space', meta: 'Welcome aboard!', ts: new Date().toISOString() },
  { id: 'a2', title: 'Checked featured listings', meta: 'Exploring marketplace', ts: new Date().toISOString() }
];

const storage = {
  get(key, fallback) {
    if (typeof localStorage === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(defaultUser);
  const [products, setProducts] = useState(defaultProducts);
  const [wishlist, setWishlist] = useState(() => storage.get('wishlist', []));
  const [chats, setChats] = useState(() => storage.get('chats', {}));
  const [activeChat, setActiveChat] = useState(null);
  const [chatProfiles, setChatProfiles] = useState(() => storage.get('chatProfiles', {}));
  const [theme, setTheme] = useState(() => storage.get('theme', 'light'));
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState(() => storage.get('activity', defaultActivity));
  const [orders, setOrders] = useState(() => storage.get('orders', []));
  const [globalQuery, setGlobalQuery] = useState('');

  useEffect(() => storage.set('wishlist', wishlist), [wishlist]);
  useEffect(() => storage.set('chats', chats), [chats]);
  useEffect(() => storage.set('orders', orders), [orders]);
  useEffect(() => storage.set('theme', theme), [theme]);
  useEffect(() => storage.set('chatProfiles', chatProfiles), [chatProfiles]);

  // Sync from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      const dbProducts = await api.getProducts();
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
      }
      const dbActivities = await api.getActivities();
      if (dbActivities && dbActivities.length > 0) {
        setActivity(dbActivities);
      }
    };
    fetchData();
  }, []);

  // Sync to local storage as fallback
  useEffect(() => storage.set('products', products), [products]);
  useEffect(() => storage.set('activity', activity), [activity]);

  const notify = (message, type = 'info') => {
    const id = nanoid();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  const addActivity = (title, meta) => {
    const newActivity = { id: nanoid(), title, meta, ts: new Date().toISOString() };
    setActivity((prev) => [newActivity, ...prev].slice(0, 20));
    api.createActivity(newActivity); // Sync to DB
  };

  const deleteActivity = (id) => {
    setActivity((prev) => prev.filter((a) => a.id !== id));
    api.deleteActivity(id); // Sync to DB
  };

  const clearActivity = () => {
    setActivity([]);
    notify('Activity cleared', 'info');
    api.clearActivities(); // Sync to DB
  };

  const login = async (payload) => {
    const nextUser = { ...payload, isAdmin: Boolean(payload.email && adminEmails.includes(payload.email.toLowerCase())) };
    setUser(nextUser);
    notify(`Welcome back, ${payload.name || 'Student'}!`, 'success');
    addActivity('Logged in', payload.college || '');
    return nextUser;
  };

  const logout = () => {
    setUser(null);
    setActiveChat(null);
    notify('Logged out', 'info');
    addActivity('Logged out', 'Session ended');
  };

  const addProduct = async (product) => {
    const newProduct = { ...product, id: nanoid(), seller: user?.name || 'You' };
    setProducts((prev) => [newProduct, ...prev]);
    notify('Product added', 'success');
    addActivity('New listing added', product.title);
    
    // Sync to DB
    const created = await api.createProduct(newProduct);
    if (created && created.id !== newProduct.id) {
       // Optional: update the ID with DB's generated ID if needed
    }
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    notify('Removed', 'warn');
    addActivity('Listing removed', id);
    api.deleteProduct(id); // Sync to DB
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      notify(exists ? 'Removed from wishlist' : 'Saved to wishlist', 'info');
      addActivity(exists ? 'Removed wishlist item' : 'Wishlisted', id);
      return exists ? prev.filter((w) => w !== id) : [...prev, id];
    });
  };

  const sendMessage = (seller, text) => {
    if (!activeChat) return;
    const chatId = activeChat.id;
    setChats((prev) => {
      const history = prev[chatId] || [];
      const next = [...history, { from: 'me', text, ts: new Date().toISOString() }];
      api.saveChat({
        id: chatId,
        userEmail: user?.email || 'unknown',
        partnerName: seller,
        productId: activeChat.partner?.id,
        messages: next
      }).catch(() => {});
      return { ...prev, [chatId]: next };
    });
    notify(`Message sent to ${seller}`, 'info');
    addActivity(`Message to ${seller}`, text);
  };

  const openChat = (partner) => {
    const matchedProduct = products.find(
      (p) => (partner.id && p.id === partner.id) || (partner.title && p.title === partner.title) || (partner.seller && p.seller === partner.seller)
    );

    const sellerName = partner.seller || partner.name || matchedProduct?.seller || 'Campus Peer';
    const itemPrice = partner.price || matchedProduct?.price || matchedProduct?.minPrice || 850;

    const fullPartner = {
      ...matchedProduct,
      ...partner,
      price: itemPrice,
      seller: sellerName,
      title: partner.title || matchedProduct?.title || 'Campus Product'
    };

    const chatId = partner.id || matchedProduct?.id || sellerName;

    setActiveChat({ id: chatId, partner: fullPartner });

    if (!chats[chatId]) {
      const initialMessages = [
        {
          from: 'partner',
          text: `Hey! I'm ${sellerName}. Let's talk about ${fullPartner.title}.`,
          ts: new Date().toISOString()
        }
      ];
      setChats((prev) => ({
        ...prev,
        [chatId]: initialMessages
      }));
      api.saveChat({ id: chatId, userEmail: user?.email || 'unknown', partnerName: sellerName, productId: fullPartner.id, messages: initialMessages }).catch(() => {});
    }

    setChatProfiles((prev) => ({
      ...prev,
      [chatId]: {
        name: sellerName,
        title: fullPartner.title,
        partner: fullPartner
      }
    }));
  };

  const completeOrder = (orderData) => {
    setOrders((prev) => [orderData, ...prev]);
    setProducts((prev) =>
      prev.map((p) => (p.id === orderData.productId ? { ...p, isSold: true, status: 'SOLD' } : p))
    );
    api.createOrder(orderData);
  };

  const filtered = useMemo(
    () => ({
      buy: products.filter((p) => p.type === 'buy'),
      rent: products.filter((p) => p.type === 'rent')
    }),
    [products]
  );

  const value = {
    user,
    setUser,
    login,
    logout,
    loading,
    setLoading,
    products,
    addProduct,
    deleteProduct,
    orders,
    completeOrder,
    wishlist,
    toggleWishlist,
    filtered,
    theme,
    setTheme,
    chats,
    chatProfiles,
    activeChat,
    setActiveChat,
    openChat,
    sendMessage,
    toasts,
    activity,
    addActivity,
    deleteActivity,
    clearActivity,
    globalQuery,
    setGlobalQuery
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
