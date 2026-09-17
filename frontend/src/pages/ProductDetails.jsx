import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import TermsModal from '../components/TermsModal';
import { FiMessageCircle, FiShield, FiHeart, FiX, FiChevronLeft, FiChevronRight, FiShoppingBag } from 'react-icons/fi';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, openChat, wishlist, toggleWishlist, orders } = useApp();
  const navigate = useNavigate();
  const [showWarranty, setShowWarranty] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentWarrantyIndex, setCurrentWarrantyIndex] = useState(0);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="section py-10 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="heading text-2xl text-gray-500">Product not found</h2>
        <button className="btn-ghost mt-6 text-brand-600" onClick={() => navigate(-1)}>
          &larr; Go Back
        </button>
      </div>
    );
  }

  const wished = wishlist.includes(product.id);
  const isSold = product.isSold || product.status === 'SOLD' || orders?.some((o) => o.productId === product.id);
  const priceDisplay = `₹${product.price || product.maxPrice || product.minPrice || 0}`;

  const productImages = product.images?.length > 0 ? product.images : (product.image ? [product.image] : []);
  const warrantyImagesList = product.warrantyImages?.length > 0 ? product.warrantyImages : (product.warrantyImage ? [product.warrantyImage] : []);

  return (
    <div className="section py-10 space-y-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm mb-4">
        &larr; Back to marketplace
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Left Column: Image & Warranty */}
          <div className="space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative group">
              {productImages.length > 0 ? (
                <>
                  <img 
                    src={productImages[currentImgIndex]} 
                    alt={`${product.title} - ${currentImgIndex + 1}`} 
                    className="w-full h-full object-cover transition duration-500"
                  />
                  {productImages.length > 1 && (
                    <>
                      <button 
                        onClick={() => setCurrentImgIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 p-2 rounded-full shadow hover:scale-110 transition opacity-0 group-hover:opacity-100 text-gray-800 dark:text-gray-200"
                      >
                        <FiChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={() => setCurrentImgIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 p-2 rounded-full shadow hover:scale-110 transition opacity-0 group-hover:opacity-100 text-gray-800 dark:text-gray-200"
                      >
                        <FiChevronRight size={24} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        {productImages.map((_, i) => (
                          <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentImgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                {product.stream}
              </div>
            </div>

            {/* Warranty Section */}
            <div className="bg-brand-50 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between border border-brand-100 dark:border-gray-700">
              <div className="flex items-center gap-3 text-brand-700 dark:text-brand-300">
                <FiShield className="text-2xl" />
                <div>
                  <p className="font-semibold text-sm">Warranty Check</p>
                  <p className="text-xs opacity-80">
                    {warrantyImagesList.length > 0 ? "Warranty card available" : "Warranty not provided"}
                  </p>
                </div>
              </div>
              {warrantyImagesList.length > 0 && (
                <button 
                  onClick={() => setShowWarranty(true)}
                  className="btn-primary text-sm px-4 py-2"
                >
                  View Card
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-col h-full">
            <div className="space-y-2 mb-6">
              <p className="text-brand-600 font-semibold uppercase tracking-wider text-sm">
                {product.category || 'General'}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {product.title}
              </h1>
              <p className="text-gray-500 text-sm">Listed by <span className="font-medium text-gray-800 dark:text-gray-300">{product.seller}</span></p>
            </div>

            <div className="mb-8">
              <p className="text-4xl font-extrabold text-accent-orange flex items-baseline gap-2">
                {priceDisplay}
                {product.type === 'rent' && <span className="text-lg text-gray-500 font-normal">/day</span>}
              </p>
              {product.minPrice && product.maxPrice && (
                <p className="text-sm text-gray-500 mt-1">Price is negotiable. Seller accepts between ₹{product.minPrice} and ₹{product.maxPrice}.</p>
              )}
            </div>

            <div className="mb-10 flex-1 relative min-h-[250px] overflow-hidden rounded-2xl bg-gray-50/80 dark:bg-gray-800/30 p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div 
                className="absolute inset-0 bg-[url('/logo.png')] bg-no-repeat bg-center opacity-[0.08] dark:opacity-[0.12] pointer-events-none transition-transform hover:scale-105 duration-1000" 
                style={{ backgroundSize: '280px' }}
              ></div>
              <div className="relative z-10">
                <h3 className="font-semibold text-lg border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                  {product.description || "No description provided by the seller."}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              {isSold ? (
                <div className="flex-1 py-4 text-center text-lg font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 rounded-2xl border border-red-200 dark:border-red-800">
                  Item Sold Out
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setShowTermsModal(true)} 
                    className="btn-primary flex-1 py-4 text-lg font-bold flex items-center justify-center gap-2 shadow-xl shadow-brand-500/30 hover:scale-[1.02] transition-transform"
                  >
                    <FiShoppingBag className="text-xl" /> {product.type === 'rent' ? 'Rent Now' : 'Buy Now'}
                  </button>
                  <button 
                    onClick={() => openChat(product)} 
                    className="btn-ghost flex-1 py-4 text-lg font-semibold flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <FiMessageCircle className="text-xl" /> {product.type === 'rent' ? 'Chat Owner' : 'Bargain Price'}
                  </button>
                </>
              )}
              <button 
                onClick={() => toggleWishlist(product.id)} 
                className={`btn py-4 px-6 text-lg flex items-center justify-center gap-2 ${wished ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 border border-brand-200 dark:border-brand-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                <FiHeart className={wished ? 'fill-brand-600 text-brand-600' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <TermsModal
          product={product}
          onClose={() => setShowTermsModal(false)}
        />
      )}

      {/* Warranty Modal */}
      {showWarranty && warrantyImagesList.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-2 w-full max-w-2xl relative shadow-2xl group">
            <button 
              onClick={() => setShowWarranty(false)}
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded-full shadow-lg hover:scale-110 transition z-10"
            >
              <FiX className="text-xl" />
            </button>
            <div className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-950 flex items-center justify-center min-h-[300px] relative">
              <img 
                src={warrantyImagesList[currentWarrantyIndex]} 
                alt={`Warranty Card - ${currentWarrantyIndex + 1}`} 
                className="max-w-full max-h-[80vh] object-contain"
              />
              {warrantyImagesList.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentWarrantyIndex((prev) => (prev === 0 ? warrantyImagesList.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow-lg hover:scale-110 transition opacity-0 group-hover:opacity-100 text-gray-800 dark:text-gray-200"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setCurrentWarrantyIndex((prev) => (prev === warrantyImagesList.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow-lg hover:scale-110 transition opacity-0 group-hover:opacity-100 text-gray-800 dark:text-gray-200"
                  >
                    <FiChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full">
                    {warrantyImagesList.map((_, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all ${i === currentWarrantyIndex ? 'w-4 bg-white' : 'w-2 bg-white/40'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
