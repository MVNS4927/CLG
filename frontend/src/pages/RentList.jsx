import { useMemo, useState } from 'react';
import { useApp } from '../state/AppContext';
import { uploadImageToCloudinary } from '../utils/api';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

const initial = {
  title: '',
  price: '',
  category: '',
  stream: 'Engineering',
  images: [],
  description: ''
};

export default function RentList() {
  const { addProduct, products, user, deleteProduct } = useApp();
  const [form, setForm] = useState(initial);
  const [uploading, setUploading] = useState(false);

  const myRentals = useMemo(() => products.filter((p) => p.seller === (user?.name || 'You') && p.type === 'rent'), [products, user]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.stream) return;
    addProduct({ ...form, price: Number(form.price), type: 'rent' });
    setForm(initial);
  };

  return (
    <div className="section py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="subtle">Rentals</p>
          <h1 className="heading">List your rental</h1>
        </div>
        <Link to="/rent/browse" className="btn-ghost text-sm rounded-full px-4 py-2 border border-brand-200">
          Browse rentals â†’
        </Link>
      </div>

      <div className="card p-6">
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold">Title</label>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                placeholder="Eg. DSLR with lens"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold">Price per day (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Category</label>
                <input
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                  placeholder="Electronics"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold">Stream</label>
                <select
                  value={form.stream}
                  onChange={(e) => set('stream', e.target.value)}
                  className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                >
                  <option>Engineering</option>
                  <option>Medical</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold">Images</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 group">
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
                      <button 
                        type="button"
                        onClick={() => set('images', form.images.filter((_, i) => i !== idx))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <span className="text-2xl text-gray-400">+</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (!files.length) return;
                        setUploading(true);
                        
                        const uploaders = files.map(file => uploadImageToCloudinary(file));
                        
                        Promise.all(uploaders).then(results => {
                          set('images', [...form.images, ...results.filter(Boolean)]);
                          setUploading(false);
                        });
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Upload multiple images (stays local until configured).</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                rows={3}
                placeholder="Condition, pickup, accessories"
              />
            </div>
            <button type="submit" className="btn-primary w-full md:w-auto px-4 py-2">
              {uploading ? 'Uploading...' : 'Add rental'}
            </button>
          </div>
          <div className="card relative overflow-hidden p-4 bg-gradient-to-br from-brand-50 to-white dark:from-gray-900 dark:to-gray-950 border-dashed border-2 border-brand-200 dark:border-brand-800">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">Live preview</p>
            </div>
            <img
              src="/logo.png"
              alt="CLG Space logo watermark"
              className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-25 object-contain"
            />
            {form.title ? (
              <div className="relative space-y-2 z-10">
                <p className="text-lg font-semibold">{form.title}</p>
                <p className="subtle">{form.category || 'Category'}</p>
                <p className="font-bold text-brand-600">₹{form.price || 0} / day</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{form.description || 'Description...'}</p>
              </div>
            ) : (
              <p className="relative subtle z-10">Fill the form to preview.</p>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="heading">Your rentals</h3>
        {myRentals.length === 0 ? (
          <EmptyState title="No rentals listed" subtitle="Add your first rental above." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRentals.map((item) => (
              <ProductCard key={item.id} item={item} onDelete={deleteProduct} showDelete />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
