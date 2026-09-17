import { useMemo, useState } from 'react';
import { useApp } from '../state/AppContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import ActivityTimeline from '../components/ActivityTimeline';

export default function Profile() {
  const { user, products, setTheme, theme, setUser, deleteProduct } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user);

  const myProducts = useMemo(() => products.filter((p) => p.seller === (user?.name || 'You') && p.type === 'buy'), [products, user]);
  const myRentals = useMemo(() => products.filter((p) => p.seller === (user?.name || 'You') && p.type === 'rent'), [products, user]);

  const save = () => {
    setUser({ ...user, ...draft });
    setEditing(false);
  };

  if (!user) return null;

  return (
    <div className="section py-10 space-y-8">
      <div className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="subtle">Profile</p>
          <h2 className="heading">{user.name || 'Student'}</h2>
          <p className="text-gray-600 dark:text-gray-300">{user.college}</p>
          <p className="text-sm text-gray-500">ID: {user.collegeId}</p>
          <p className="text-sm text-gray-500">Stream: {user.stream}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn-ghost border px-3 py-2 rounded-xl">
            Toggle theme
          </button>
          <button onClick={() => setEditing(!editing)} className="btn-primary px-3 py-2">
            {editing ? 'Save' : 'Edit profile'}
          </button>
        </div>
      </div>

      {editing && (
        <div className="card p-5 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { label: 'Name', key: 'name' },
              { label: 'Email', key: 'email' },
              { label: 'College', key: 'college' },
              { label: 'College ID', key: 'collegeId' }
            ].map((f) => (
              <div key={f.key}>
                <label className="text-sm font-semibold">{f.label}</label>
                <input
                  value={draft?.[f.key] || ''}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                />
              </div>
            ))}
            <div>
              <label className="text-sm font-semibold">Stream</label>
              <select
                value={draft.stream}
                onChange={(e) => setDraft((d) => ({ ...d, stream: e.target.value }))}
                className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
              >
                <option>Engineering</option>
                <option>Medical</option>
              </select>
            </div>
          </div>
          <button onClick={save} className="btn-primary px-4 py-2">
            Save changes
          </button>
        </div>
      )}

      <section className="space-y-3">
        <h3 className="heading">My Products</h3>
        {myProducts.length === 0 ? (
          <EmptyState title="No products" subtitle="List something to see it here." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myProducts.map((item) => (
              <ProductCard key={item.id} item={item} onDelete={deleteProduct} showDelete />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="heading">My Rentals</h3>
        {myRentals.length === 0 ? (
          <EmptyState title="No rentals" subtitle="Rent out gear to appear here." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRentals.map((item) => (
              <ProductCard key={item.id} item={item} onDelete={deleteProduct} showDelete />
            ))}
          </div>
        )}
      </section>

      <ActivityTimeline limit={10} />
    </div>
  );
}
