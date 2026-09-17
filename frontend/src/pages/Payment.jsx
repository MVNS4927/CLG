import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { api } from '../utils/api';
import { 
  FiShield, FiArrowLeft, FiCheckCircle, FiCopy, FiSmartphone, 
  FiCreditCard, FiGlobe, FiDollarSign, FiClock, FiLock, FiDownload, 
  FiCheck, FiAward, FiTag, FiZap, FiInfo, FiPrinter, FiShoppingBag, FiPlay
} from 'react-icons/fi';

export default function Payment() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, user, notify, addActivity, completeOrder } = useApp();

  const product = products.find((p) => p.id === productId);

  const initialMethod = location.state?.paymentMethod || 'upi';
  const [activeTab, setActiveTab] = useState(initialMethod);
  const [loading, setLoading] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(null);
  const [txRefId, setTxRefId] = useState('');

  // Mock Procedure Simulation State
  const [showMockSim, setShowMockSim] = useState(false);
  const [simStep, setSimStep] = useState(1);
  const [simProgress, setSimProgress] = useState(0);

  // Form states for Card
  const [cardForm, setCardForm] = useState({
    number: '',
    name: user?.name || '',
    expiry: '',
    cvv: ''
  });
  const [selectedBank, setSelectedBank] = useState('SBI');

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!product) {
    return (
      <div className="section py-16 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="heading text-2xl text-gray-500">Order item not found</h2>
        <button onClick={() => navigate('/buy')} className="btn-primary mt-6">
          Return to Marketplace
        </button>
      </div>
    );
  }

  const originalPrice = product.price || product.maxPrice || product.minPrice || 0;
  const totalPrice = location.state?.finalPrice || originalPrice;
  const savings = originalPrice > totalPrice ? originalPrice - totalPrice : 0;
  const upiId = `clgspace.${product.id.slice(0, 6)}@paytm`;

  const handleDemoPaymentCompleted = () => {
    const orderData = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      productTitle: product.title,
      amount: totalPrice,
      paymentMethod: activeTab === 'upi' ? 'UPI QR CODE' : activeTab === 'card' ? 'CREDIT / DEBIT CARD' : activeTab === 'netbanking' ? `NET BANKING (${selectedBank})` : 'CAMPUS CASH HANDOVER',
      status: 'COMPLETED'
    };
    if (completeOrder) completeOrder({ ...orderData, productId: product.id });
    notify('Demo Payment Completed Screen Loaded!', 'success');
    addActivity('Purchased Product (Demo)', `${product.title} (₹${totalPrice})`);
    setOrderCompleted(orderData);
  };

  const startMockProcedure = () => {
    setShowMockSim(true);
    setSimStep(1);
    setSimProgress(15);

    setTimeout(() => { setSimStep(2); setSimProgress(40); }, 1200);
    setTimeout(() => { setSimStep(3); setSimProgress(65); }, 2600);
    setTimeout(() => { setSimStep(4); setSimProgress(88); }, 4000);
    setTimeout(() => {
      setSimStep(5);
      setSimProgress(100);
      setTimeout(() => {
        setShowMockSim(false);
        const methodTitle = activeTab === 'upi' ? 'UPI QR Code' : activeTab === 'card' ? 'Credit / Debit Card' : activeTab === 'netbanking' ? `Net Banking (${selectedBank})` : 'Campus Handover Cash';
        executeOrderSubmission(`MOCK PROCEDURE (${methodTitle.toUpperCase()})`);
      }, 900);
    }, 5200);
  };

  // Render full Payment Completed Receipt Page when transaction completes
  if (orderCompleted) {
    return (
      <div className="section py-12 space-y-8 animate-fade-in max-w-2xl mx-auto min-h-screen text-center">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-6">
          
          <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-5xl font-bold shadow-xl shadow-emerald-500/20 animate-bounce">
            <FiCheckCircle />
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              PAYMENT COMPLETED • ESCROW DEPOSITED
            </span>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mt-4 tracking-tight">
              Payment Completed Successfully!
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Your funds of <strong className="text-gray-900 dark:text-white font-bold">₹{totalPrice}</strong> are held safely in CLG Space Escrow.
            </p>
          </div>

          {/* Detailed Transaction Breakdown Card */}
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-3xl p-6 text-left border border-gray-200 dark:border-gray-700 space-y-3.5 text-sm font-sans shadow-inner">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
              <span className="text-gray-500 font-semibold">Transaction ID</span>
              <span className="font-mono font-black text-brand-600 dark:text-brand-400 text-base">{orderCompleted.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-semibold">Item Purchased</span>
              <span className="font-bold text-gray-900 dark:text-white truncate max-w-[240px]">{product.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-semibold">Seller Name</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{product.seller}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-semibold">Buyer Name</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{user?.name || 'Verified Student'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-semibold">Payment Method</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900/60">
                {orderCompleted.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-semibold">Escrow Pickup PIN</span>
              <span className="font-mono font-black text-white bg-slate-900 dark:bg-slate-950 px-3 py-1 rounded-xl tracking-widest text-sm shadow">
                PIN-{Math.floor(1000 + Math.random() * 9000)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-semibold">Date & Time</span>
              <span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-base font-black text-gray-900 dark:text-white">Total Amount Paid</span>
              <span className="text-3xl text-accent-orange font-black">₹{totalPrice}</span>
            </div>
          </div>

          {/* Working Explanation Box */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-3xl p-5 text-left text-xs space-y-2">
            <h4 className="font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 text-sm">
              <FiShield className="text-emerald-600 text-base" /> How Payment Escrow & Handover Works:
            </h4>
            <ul className="space-y-1.5 text-emerald-900 dark:text-emerald-200 pl-4 list-disc font-medium">
              <li><strong>Step 1 (Deposit Secured)</strong>: Money is held safely in CLG Space Escrow database.</li>
              <li><strong>Step 2 (Campus Meetup)</strong>: Meet seller <strong>{product.seller}</strong> at a designated campus spot.</li>
              <li><strong>Step 3 (Handover PIN)</strong>: Provide seller your <strong>Escrow Release PIN</strong> after inspecting item.</li>
              <li><strong>Step 4 (Fund Release)</strong>: Seller inputs PIN to instantly receive payment into their account.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button 
              onClick={() => window.print()} 
              className="btn-ghost flex-1 py-4 text-sm font-bold border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <FiPrinter className="text-lg" /> Print Receipt
            </button>
            <Link to="/buy" className="btn-primary flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-brand-500/30 rounded-2xl">
              <FiShoppingBag className="text-lg" /> Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Detect card brand
  const getCardBrand = (num) => {
    const clean = num.replace(/\s+/g, '');
    if (/^4/.test(clean)) return 'VISA';
    if (/^5[1-5]/.test(clean)) return 'Mastercard';
    if (/^60/.test(clean) || /^65/.test(clean)) return 'RuPay';
    if (/^3[47]/.test(clean)) return 'Amex';
    return 'CARD';
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardForm((prev) => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardForm((prev) => ({ ...prev, expiry: `${raw.slice(0, 2)}/${raw.slice(2)}` }));
    } else {
      setCardForm((prev) => ({ ...prev, expiry: raw }));
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    notify('UPI VPA copied to clipboard!', 'info');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const executeOrderSubmission = async (methodUsed) => {
    setLoading(true);
    try {
      const orderPayload = {
        productId: product.id,
        productTitle: product.title,
        amount: totalPrice,
        paymentMethod: methodUsed.toUpperCase(),
        buyerName: user?.name || 'Campus Student',
        buyerEmail: user?.email || 'student@college.edu'
      };

      const res = await api.createOrder(orderPayload);
      const orderData = res || {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        productTitle: product.title,
        amount: totalPrice,
        paymentMethod: methodUsed.toUpperCase(),
        status: 'COMPLETED'
      };

      if (completeOrder) completeOrder({ ...orderData, productId: product.id });
      notify('Payment verified! Escrow deposit successful.', 'success');
      addActivity('Purchased Product', `${product.title} (₹${totalPrice})`);
      setOrderCompleted(orderData);
    } catch (err) {
      console.error(err);
      notify('Payment transaction failed. Please try again.', 'error');
    } finally {
      setLoading(false);
      setShowOtpModal(false);
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (!cardForm.number || !cardForm.expiry || !cardForm.cvv) {
      notify('Please enter complete credit/debit card details', 'warn');
      return;
    }
    setShowOtpModal(true);
  };

  const handleOtpVerify = () => {
    if (otpInput.length < 4) {
      notify('Please enter a valid 4-digit SMS OTP', 'warn');
      return;
    }
    executeOrderSubmission('Card Payment');
  };

  return (
    <div className="section py-8 space-y-8 animate-fade-in max-w-6xl mx-auto min-h-screen">
      
      {/* Top Header / Branding Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost p-3 rounded-full border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <FiLock size={12} /> 256-BIT SSL ENCRYPTED GATEWAY
              </span>
              <span className="bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                ESCROW PROTECTED
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mt-1 tracking-tight">
              CLG Space Express Checkout
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={startMockProcedure}
            className="btn-primary text-xs font-extrabold px-4 py-2.5 flex items-center gap-2 shadow-lg shadow-brand-500/25 rounded-2xl hover:scale-105 transition"
          >
            <FiPlay className="text-white text-sm animate-pulse" /> Run Mock Procedure
          </button>

          <button
            onClick={handleDemoPaymentCompleted}
            className="btn-ghost text-xs font-extrabold px-3.5 py-2.5 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl hover:bg-emerald-100 flex items-center gap-1.5 shadow-sm"
          >
            <FiCheckCircle className="text-emerald-600 text-base" /> Preview Receipt
          </button>
          
          {/* Security Session Timer */}
          <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 rounded-2xl px-4 py-2 flex items-center gap-3 text-amber-900 dark:text-amber-300 text-xs font-semibold shadow-sm">
            <FiClock className="animate-spin text-amber-600 text-base" />
            <div>
              <p className="opacity-80 text-[10px] uppercase font-bold tracking-wider">Session Timer</p>
              <span className="font-mono text-xs font-bold text-amber-900 dark:text-amber-200">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Order Summary & Item Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Order Summary
              </h3>
              <span className="text-xs font-bold text-gray-400 font-mono">Ref: #{product.id.slice(0, 8).toUpperCase()}</span>
            </div>

            {/* Item Details */}
            <div className="flex gap-4">
              <img
                src={product.images?.[0] || product.image || '/logo.png'}
                alt={product.title}
                className="w-24 h-24 object-cover rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-full inline-block">
                  {product.stream} • {product.category || 'Marketplace'}
                </span>
                <h4 className="font-bold text-gray-900 dark:text-white text-base leading-snug truncate">
                  {product.title}
                </h4>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  Seller: <span className="font-semibold text-gray-800 dark:text-gray-200">{product.seller}</span>
                  <FiAward className="text-amber-500 text-sm inline" title="Verified College Peer" />
                </p>
              </div>
            </div>

            {/* Savings Banner if bargain accepted */}
            {savings > 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-3 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <FiTag className="text-base text-emerald-600 shrink-0" />
                <span>Negotiated Deal Accepted! You save ₹{savings} off listed price.</span>
              </div>
            )}

            {/* Item Price Breakdown */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Listed Price</span>
                <span className={savings > 0 ? "line-through text-gray-400" : ""}>₹{originalPrice}</span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Bargain Agreed Discount</span>
                  <span>- ₹{savings}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Escrow Safe Payment Processing</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Campus Verification Protection</span>
                <span className="text-emerald-600 font-bold">INCLUDED</span>
              </div>
              
              <div className="flex justify-between items-center text-lg font-black text-gray-900 dark:text-white pt-4 border-t border-gray-200 dark:border-gray-800">
                <span>Total Amount Payable</span>
                <span className="text-3xl font-extrabold text-accent-orange">₹{totalPrice}</span>
              </div>
            </div>

            {/* Escrow Guarantee Box */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200 shadow-sm">
              <FiShield className="text-2xl shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-extrabold text-sm mb-0.5">100% Escrow Protection Guarantee</p>
                <p className="opacity-90 leading-relaxed">
                  Your funds are locked safely in escrow and are only released to the seller after you meet on campus, inspect the item, and confirm satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Payment Gateway (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-800 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Choose Payment Method
              </h3>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <FiZap /> Instant Settlement
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl">
              {[
                { id: 'upi', label: 'UPI / QR', icon: FiSmartphone },
                { id: 'card', label: 'Cards', icon: FiCreditCard },
                { id: 'netbanking', label: 'Net Banking', icon: FiGlobe },
                { id: 'cod', label: 'Campus Meetup', icon: FiDollarSign },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-3 rounded-xl text-xs md:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                      active
                        ? 'bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-md ring-2 ring-brand-500/20'
                        : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className="text-base" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: UPI & QR CODE */}
            {activeTab === 'upi' && (
              <div className="space-y-6 animate-fade-in text-center">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-brand-50/80 via-indigo-50/50 to-emerald-50/40 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 border border-brand-100 dark:border-gray-700 flex flex-col items-center shadow-inner relative">
                  
                  <p className="text-xs uppercase tracking-wider font-extrabold text-brand-700 dark:text-brand-300 mb-1">
                    Scan & Pay with Any UPI App
                  </p>
                  <p className="text-xs text-gray-500 mb-4">GPay • PhonePe • Paytm • BHIM • Amazon Pay</p>
                  
                  {/* Official Marketplace QR Code Card */}
                  <div className="bg-white p-5 rounded-3xl shadow-2xl border border-gray-200 my-2 flex flex-col items-center relative group">
                    <div className="relative">
                      <svg className="w-52 h-52" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill="#ffffff" rx="4" />
                        <path d="M0,0 h30 v30 h-30 z M40,0 h20 v20 h-20 z M70,0 h30 v30 h-30 z M0,40 h20 v20 h-20 z M30,30 h40 v40 h-40 z M80,40 h20 v20 h-20 z M0,70 h30 v30 h-30 z M40,80 h20 v20 h-20 z M70,70 h30 v30 h-30 z" fill="#0f172a" />
                        <circle cx="50" cy="50" r="12" fill="#2563eb" />
                        <path d="M46,46 h8 v8 h-8 z" fill="#ffffff" />
                      </svg>
                      <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center">
                        <span className="bg-black/75 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">Scan to Pay</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">Amount: ₹{totalPrice}</span>
                    </div>
                  </div>

                  {/* UPI Apps Badges */}
                  <div className="flex flex-wrap gap-2 justify-center my-4">
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Amazon Pay'].map((app) => (
                      <span key={app} className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> {app}
                      </span>
                    ))}
                  </div>

                  {/* Copyable VPA Handle */}
                  <div className="w-full max-w-md flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-2.5 px-4 shadow-sm">
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">UPI VPA ID</p>
                      <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200 truncate">{upiId}</p>
                    </div>
                    <button
                      onClick={handleCopyUpi}
                      className="btn-ghost text-xs px-3 py-1.5 text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1 rounded-xl"
                    >
                      {copiedUpi ? <FiCheck className="text-emerald-500 text-base" /> : <FiCopy className="text-base" />}
                      {copiedUpi ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Optional UTR / Reference Input */}
                <div className="text-left space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">UPI Reference / UTR Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 324156789012"
                    value={txRefId}
                    onChange={(e) => setTxRefId(e.target.value)}
                    className="input font-mono text-sm"
                  />
                </div>

                <button
                  disabled={loading}
                  onClick={() => executeOrderSubmission('UPI QR Code')}
                  className="btn-primary w-full py-4 text-base font-bold shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                >
                  {loading ? (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
                  ) : (
                    <>
                      <FiCheckCircle className="text-xl" /> Confirm Payment of ₹{totalPrice}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 2: CREDIT / DEBIT CARD */}
            {activeTab === 'card' && (
              <form onSubmit={handleCardSubmit} className="space-y-6 animate-fade-in">
                
                {/* 3D Realistic Credit Card Graphic */}
                <div className="rounded-3xl p-6 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 text-white shadow-2xl space-y-6 relative overflow-hidden border border-slate-700/80">
                  <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-brand-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-xs font-mono font-bold tracking-widest text-brand-300">CLG SPACE PLATINUM ESCROW</span>
                    <span className="text-xs font-black px-2.5 py-1 bg-white/10 rounded-lg uppercase font-mono tracking-wider backdrop-blur-md border border-white/10">
                      {getCardBrand(cardForm.number)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 relative z-10">
                    {/* Metallic Chip */}
                    <div className="w-11 h-8 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 rounded-md border border-amber-500/40 shadow-md"></div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-400">CONTACTLESS SECURE</span>
                  </div>

                  <div className="font-mono text-xl md:text-2xl font-bold tracking-widest relative z-10">
                    {cardForm.number || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex justify-between text-xs font-mono relative z-10 pt-2 border-t border-white/10">
                    <div>
                      <p className="opacity-60 text-[9px] uppercase tracking-wider font-sans">CARD HOLDER</p>
                      <p className="font-bold uppercase tracking-wider">{cardForm.name || 'CAMPUS STUDENT'}</p>
                    </div>
                    <div>
                      <p className="opacity-60 text-[9px] uppercase tracking-wider font-sans">EXPIRES</p>
                      <p className="font-bold">{cardForm.expiry || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>

                {/* Inputs Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Card Number</label>
                    <input
                      required
                      type="text"
                      placeholder="4532 0123 4567 8910"
                      value={cardForm.number}
                      onChange={handleCardNumberChange}
                      className="input font-mono tracking-wider"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Cardholder Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Full Name as shown on card"
                      value={cardForm.name}
                      onChange={(e) => setCardForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Expiry Date</label>
                      <input
                        required
                        type="text"
                        placeholder="MM/YY"
                        value={cardForm.expiry}
                        onChange={handleExpiryChange}
                        className="input font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">CVV Code</label>
                      <input
                        required
                        maxLength={4}
                        type="password"
                        placeholder="•••"
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                        className="input font-mono text-center tracking-widest"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-base font-bold shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                >
                  <FiLock className="text-lg" /> Pay ₹{totalPrice} with 3D Secure
                </button>
              </form>
            )}

            {/* TAB 3: NET BANKING */}
            {activeTab === 'netbanking' && (
              <div className="space-y-6 animate-fade-in">
                <label className="text-sm font-bold text-gray-800 dark:text-gray-200 block">Select Popular Bank</label>
                
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                  {[
                    { code: 'SBI', name: 'SBI' },
                    { code: 'HDFC', name: 'HDFC Bank' },
                    { code: 'ICICI', name: 'ICICI Bank' },
                    { code: 'AXIS', name: 'Axis Bank' },
                    { code: 'KOTAK', name: 'Kotak' },
                    { code: 'PNB', name: 'PNB' }
                  ].map((bank) => (
                    <button
                      key={bank.code}
                      type="button"
                      onClick={() => setSelectedBank(bank.code)}
                      className={`p-3.5 rounded-2xl border text-center font-bold text-xs md:text-sm transition-all ${
                        selectedBank === bank.code
                          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 ring-2 ring-brand-500/20'
                          : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      {bank.name}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Select from all supported Indian banks</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="input"
                  >
                    <option value="SBI">State Bank of India (SBI)</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="KOTAK">Kotak Mahindra Bank</option>
                    <option value="PNB">Punjab National Bank</option>
                    <option value="BOB">Bank of Baroda</option>
                    <option value="CANARA">Canara Bank</option>
                    <option value="UNION">Union Bank of India</option>
                    <option value="IDFC">IDFC FIRST Bank</option>
                  </select>
                </div>

                <button
                  disabled={loading}
                  onClick={() => executeOrderSubmission(`Net Banking (${selectedBank})`)}
                  className="btn-primary w-full py-4 text-base font-bold shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                >
                  {loading ? (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
                  ) : (
                    <>
                      <FiGlobe className="text-lg" /> Pay ₹{totalPrice} via {selectedBank} Net Banking
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 4: CAMPUS MEETUP / CASH */}
            {activeTab === 'cod' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-4 text-xs text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-300">
                    <FiDollarSign className="text-xl text-amber-600 shrink-0" />
                    <span>Pay Cash During Physical Campus Meetup</span>
                  </div>
                  <p className="leading-relaxed">
                    Arrange a safe meeting on campus with <strong>{product.seller}</strong> at spots like the Student Canteen, Central Library, or Main Gate. Inspect the item in person and pay cash.
                  </p>
                  <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl p-3 border border-amber-300/50 flex items-center gap-2 font-semibold">
                    <FiInfo className="text-brand-600 text-lg shrink-0" />
                    <span>An Escrow Release PIN code will be generated upon placing this order.</span>
                  </div>
                </div>

                <button
                  disabled={loading}
                  onClick={() => executeOrderSubmission('Campus Cash Handover')}
                  className="btn-primary w-full py-4 text-base font-bold shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                >
                  {loading ? (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
                  ) : (
                    <>
                      <FiCheckCircle className="text-xl" /> Confirm Campus Cash Handover (₹{totalPrice})
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* 3D SECURE OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-900/60 dark:text-brand-400 mx-auto flex items-center justify-center text-3xl font-bold">
              <FiLock />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">3D Secure OTP Verification</h3>
              <p className="text-xs text-gray-500 mt-1">An authentication code has been sent to your registered mobile number for card payment of ₹{totalPrice}.</p>
            </div>

            <input
              type="text"
              maxLength={6}
              placeholder="1 2 3 4"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
              className="input text-center font-mono text-3xl tracking-widest"
            />

            <div className="flex gap-3">
              <button onClick={() => setShowOtpModal(false)} className="btn-ghost flex-1 py-3.5 text-sm font-semibold">
                Cancel
              </button>
              <button onClick={handleOtpVerify} className="btn-primary flex-1 py-3.5 text-sm font-bold shadow-lg shadow-brand-500/30">
                Authorize Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER COMPLETED OFFICIAL RECEIPT MODAL */}
      {orderCompleted && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-800 space-y-6 text-center relative overflow-hidden">
            
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-4xl font-bold shadow-xl shadow-emerald-500/20">
              <FiCheckCircle />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                TRANSACTION CONFIRMED
              </span>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                Order Completed Successfully!
              </h2>
              <p className="text-xs text-gray-500 mt-1">Payment of ₹{totalPrice} is deposited securely in CLG Space Escrow.</p>
            </div>

            {/* Official Order Receipt Card */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-3xl p-5 text-left border border-gray-200 dark:border-gray-700 space-y-2.5 text-xs font-sans">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{orderCompleted.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Item</span>
                <span className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{product.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Seller</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{product.seller}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Mode</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">{orderCompleted.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Escrow Pickup Code</span>
                <span className="font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  PIN-{Math.floor(1000 + Math.random() * 9000)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700 text-sm font-black">
                <span>Total Amount Paid</span>
                <span className="text-2xl text-accent-orange font-extrabold">₹{totalPrice}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/buy" className="btn-ghost flex-1 py-3.5 text-sm font-semibold">
                Back to Marketplace
              </Link>
              <Link to="/" className="btn-primary flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* INTERACTIVE MOCK PAYMENT SIMULATION MODAL */}
      {showMockSim && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-800 space-y-6 text-center relative overflow-hidden">
            
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-brand-500 animate-ping"></span>
                <h3 className="font-black text-lg text-gray-900 dark:text-white">Live Payment Procedure Simulation</h3>
              </div>
              <span className="text-xs font-mono font-black bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800">
                STEP {simStep} OF 5
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-brand-600 via-emerald-500 to-accent-orange rounded-full transition-all duration-500"
                  style={{ width: `${simProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-gray-400 font-bold">
                <span>SIMULATION PROGRESS</span>
                <span>{simProgress}%</span>
              </div>
            </div>

            {/* Step Status Display */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
              {simStep === 1 && (
                <div className="space-y-2 animate-fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center text-3xl font-bold">
                    <FiLock className="animate-pulse" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">1. Handshake & 256-Bit SSL Encryption</h4>
                  <p className="text-xs text-gray-500">Establishing 256-bit SSL encrypted socket with CLG Space Escrow Vault...</p>
                </div>
              )}

              {simStep === 2 && (
                <div className="space-y-2 animate-fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center text-3xl font-bold">
                    <FiShield className="animate-pulse" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">2. Verifying Peer Credentials</h4>
                  <p className="text-xs text-gray-500">Authenticating buyer ({user?.name || 'Verified Student'}) & seller ({product.seller})...</p>
                </div>
              )}

              {simStep === 3 && (
                <div className="space-y-2 animate-fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center text-3xl font-bold">
                    <FiZap className="animate-bounce" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">3. Processing Payment Deposit</h4>
                  <p className="text-xs text-gray-500">Authorizing deposit of ₹{totalPrice} via {activeTab.toUpperCase()} gateway...</p>
                </div>
              )}

              {simStep === 4 && (
                <div className="space-y-2 animate-fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center text-3xl font-bold">
                    <FiTag className="animate-spin" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">4. Generating Escrow Handover PIN</h4>
                  <p className="text-xs text-gray-500">Locking funds in campus escrow ledger and generating 4-digit PIN code...</p>
                </div>
              )}

              {simStep === 5 && (
                <div className="space-y-2 animate-fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-3xl font-bold">
                    <FiCheckCircle />
                  </div>
                  <h4 className="font-bold text-emerald-600 dark:text-emerald-400">5. Payment Verified & Escrow Locked!</h4>
                  <p className="text-xs text-gray-500">Transaction completed successfully. Opening official receipt...</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowMockSim(false)}
              className="btn-ghost w-full py-3 text-xs text-gray-400 font-semibold"
            >
              Cancel Simulation
            </button>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
