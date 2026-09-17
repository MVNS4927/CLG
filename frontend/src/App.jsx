import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useApp } from './state/AppContext';
import Navbar from './components/Navbar';
import LoginRegister from './pages/LoginRegister';
import Home from './pages/Home';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import RentBrowse from './pages/RentBrowse';
import RentList from './pages/RentList';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import Payment from './pages/Payment';
import ChatPanel from './components/ChatPanel';
import ToastStack from './components/ToastStack';
import GlobalSearch from './components/GlobalSearch';
import OfflineBanner from './components/OfflineBanner';
import Footer from './components/Footer';

const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

function App() {
  const { user, theme } = useApp();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div>
      <OfflineBanner />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors">
        <Navbar />
        <Routes>
          <Route path="/auth" element={<LoginRegister />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buy"
            element={
              <ProtectedRoute>
                <Buy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <Sell />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/:productId"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rent"
            element={<Navigate to="/rent/browse" replace />}
          />
          <Route
            path="/rent/browse"
            element={
              <ProtectedRoute>
                <RentBrowse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rent/list"
            element={
              <ProtectedRoute>
                <RentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={user ? '/' : '/auth'} replace />} />
        </Routes>
        <ChatPanel />
        <ToastStack />
        <GlobalSearch />
        <Footer />
      </div>
    </div>
  );
}

export default App;
