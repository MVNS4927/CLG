import { useEffect, useState } from 'react';
import { FiWifiOff } from 'react-icons/fi';

export default function OfflineBanner() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (online) return null;
  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-amber-500 text-white text-sm text-center py-2 flex items-center justify-center gap-2">
      <FiWifiOff /> You are offline. Changes are stored locally.
    </div>
  );
}
