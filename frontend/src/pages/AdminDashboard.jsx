import { useEffect, useMemo, useState } from 'react';
import { FiRefreshCw, FiTrash2, FiPlus, FiShield } from 'react-icons/fi';
import { useApp } from '../state/AppContext';
import { api } from '../utils/api';

const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);

export default function AdminDashboard() {
  const { user } = useApp();
  const [key, setKey] = useState(() => sessionStorage.getItem('admin_key') || '');
  const [data, setData] = useState({ users: [], products: [], chats: [] });
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [form, setForm] = useState({ title: '', price: '', type: 'buy', seller: 'CLG Space Admin', stream: 'Engineering' });
  const isAllowlisted = Boolean(user?.email && adminEmails.includes(user.email.toLowerCase()));

  const load = async () => {
    if (!isAllowlisted || !key.trim()) return false;
    try { setData(await api.adminOverview(user.email, key)); setError(''); sessionStorage.setItem('admin_key', key); return true; }
    catch { setError('Admin authorization failed. Check your access key.'); return false; }
  };
  const unlock = async () => {
    setError('');
    if (await load()) setUnlocked(true);
  };

  const addProduct = async (event) => {
    event.preventDefault();
    try {
      await api.adminCreateProduct(user.email, key, { ...form, price: Number(form.price), images: [], warrantyImages: [], description: 'Admin listing' });
      setForm({ ...form, title: '', price: '' }); await load();
    } catch { setError('Could not add product.'); }
  };
  const removeProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try { await api.adminDeleteProduct(user.email, key, id); await load(); } catch { setError('Could not delete product.'); }
  };

  if (!isAllowlisted) return <div className="section py-16"><div className="card p-8 text-center"><FiShield className="mx-auto text-4xl text-red-500" /><h1 className="heading mt-3">Admin access restricted</h1><p className="subtle mt-2">Your signed-in email is not in the administrator allowlist.</p></div></div>;

  return <div className="section py-10 space-y-6">
    <div className="flex items-center justify-between"><div><p className="subtle">Private control room</p><h1 className="heading">Admin dashboard</h1></div>{unlocked && <button onClick={load} className="btn-ghost px-3 py-2"><FiRefreshCw /> Refresh</button>}</div>
    <div className="grid md:grid-cols-3 gap-4"><div className="card p-5"><p className="subtle">Users</p><p className="text-3xl font-bold">{data.users.length}</p></div><div className="card p-5"><p className="subtle">Products</p><p className="text-3xl font-bold">{data.products.length}</p></div><div className="card p-5"><p className="subtle">Chat threads</p><p className="text-3xl font-bold">{data.chats.length}</p></div></div>
    {error && <p className="text-red-600">{error}</p>}
    {!unlocked && <div className="card p-5"><label className="text-sm font-semibold">Admin access key</label><div className="flex gap-2 mt-2"><input type="password" value={key} onChange={(event) => { setKey(event.target.value); setError(''); }} className="input flex-1" placeholder="Enter your admin access key" /><button onClick={unlock} className="btn-primary px-4">Unlock</button></div>{error && <p className="text-red-600 text-sm mt-2">{error}</p>}</div>}
    <div className="card p-5 space-y-3"><h2 className="heading text-xl">Add product</h2><form onSubmit={addProduct} className="grid md:grid-cols-5 gap-2"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="input" /><input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" className="input" /><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input"><option value="buy">Buy</option><option value="rent">Rent</option></select><input value={form.seller} onChange={(e) => setForm({ ...form, seller: e.target.value })} placeholder="Seller" className="input" /><button className="btn-primary px-4"><FiPlus /> Add</button></form></div>
    <div className="card p-5"><h2 className="heading text-xl mb-3">All products</h2><div className="space-y-2">{data.products.map((product) => <div key={product.id} className="flex items-center justify-between border-b py-3"><div><p className="font-semibold">{product.title}</p><p className="subtle">{product.seller || 'Unknown'} · ₹{product.price}</p></div><button onClick={() => removeProduct(product.id)} className="btn-ghost text-red-600" title="Delete product"><FiTrash2 /></button></div>)}</div></div>
    <div className="grid lg:grid-cols-2 gap-6"><div className="card p-5"><h2 className="heading text-xl mb-3">User data</h2>{data.users.map((entry) => <div key={entry.id} className="border-b py-2"><p className="font-semibold">{entry.name}</p><p className="subtle">{entry.email} · {entry.college || 'No college'}</p></div>)}</div><div className="card p-5"><h2 className="heading text-xl mb-3">Chats</h2>{data.chats.map((chat) => <div key={chat.id} className="border-b py-2"><p className="font-semibold">{chat.userEmail} with {chat.partnerName}</p><p className="subtle">{chat.messages?.length || 0} messages</p>{chat.messages?.map((message, index) => <p key={index} className="text-sm mt-1"><b>{message.from}:</b> {message.text}</p>)}</div>)}</div></div>
  </div>;
}