import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { FiShield, FiX, FiCheckCircle, FiCreditCard, FiSmartphone, FiGlobe, FiDollarSign } from 'react-icons/fi';

export default function TermsModal({ product, customPrice, onClose }) {
  const navigate = useNavigate();
  const { setActiveChat } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [checkedTerms, setCheckedTerms] = useState({
    condition: false,
    policy: false,
    escrow: false
  });

  const allChecked = checkedTerms.condition && checkedTerms.policy && checkedTerms.escrow;
  const displayPrice = customPrice !== undefined && customPrice !== null ? customPrice : (product?.price || 0);

  const handleProceed = () => {
    if (!allChecked) return;
    if (setActiveChat) setActiveChat(null);
    onClose();
    navigate(`/checkout/${product.id}`, {
      state: {
        paymentMethod,
        agreedTerms: true,
        productId: product.id,
        finalPrice: displayPrice
      }
    });
  };

  const paymentOptions = [
    { id: 'upi', name: 'UPI & Instant QR Code', icon: FiSmartphone, badge: 'Popular & Fast' },
    { id: 'card', name: 'Credit / Debit Card', icon: FiCreditCard, badge: 'Instant Escrow' },
    { id: 'netbanking', name: 'Net Banking', icon: FiGlobe, badge: 'All Indian Banks' },
    { id: 'cod', name: 'Campus Meetup / Cash', icon: FiDollarSign, badge: 'Pay at Handover' },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-2xl font-bold">
            <FiShield />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400 font-bold">Checkout Step 1 of 2</span>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Confirm Payment & Terms</h2>
          </div>
        </div>

        {/* Order Preview Box */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 flex items-center gap-4 mb-6">
          <img
            src={product.images?.[0] || product.image || '/logo.png'}
            alt={product.title}
            className="w-16 h-16 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate">{product.title}</h4>
            <p className="text-xs text-gray-500">Seller: <span className="font-medium text-gray-700 dark:text-gray-300">{product.seller}</span></p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-accent-orange">₹{displayPrice}</p>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">Escrow Protected</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-3 mb-6">
          <label className="text-sm font-bold text-gray-800 dark:text-gray-200 block">Select Preferred Payment Method</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {paymentOptions.map((opt) => {
              const Icon = opt.icon;
              const selected = paymentMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    selected
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className={`text-xl mt-0.5 ${selected ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-semibold text-sm leading-snug">{opt.name}</p>
                    <span className="text-[10px] text-gray-500">{opt.badge}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Terms & Conditions Checkboxes */}
        <div className="space-y-3 mb-6">
          <label className="text-sm font-bold text-gray-800 dark:text-gray-200 block">
            Campus Marketplace Terms & Safety Agreement
          </label>
          <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 rounded-2xl p-4 space-y-3 text-xs text-amber-900 dark:text-amber-200">
            
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={checkedTerms.condition}
                onChange={(e) => setCheckedTerms((prev) => ({ ...prev, condition: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>
                I agree to inspect the item physical and working condition during campus handover with the seller.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={checkedTerms.policy}
                onChange={(e) => setCheckedTerms((prev) => ({ ...prev, policy: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>
                I agree to CLG Space anti-fraud rules and safety protocols for verified college peer transactions.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={checkedTerms.escrow}
                onChange={(e) => setCheckedTerms((prev) => ({ ...prev, escrow: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>
                I acknowledge payment will be securely processed and released to seller upon buyer confirmation.
              </span>
            </label>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-ghost flex-1 py-3 text-sm text-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            disabled={!allChecked}
            onClick={handleProceed}
            className={`btn-primary flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg ${
              !allChecked ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:scale-[1.02] shadow-brand-500/25'
            }`}
          >
            <FiCheckCircle /> Accept & Proceed to Payment
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
