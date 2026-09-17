import { FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { useApp } from '../state/AppContext';

const icons = {
  success: <FiCheckCircle className="text-emerald-500" />,
  info: <FiInfo className="text-brand-500" />,
  warn: <FiAlertTriangle className="text-amber-500" />
};

export default function ToastStack() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="card flex items-center gap-3 px-3 py-2 shadow-soft min-w-[240px] border border-brand-100 dark:border-brand-900/40"
        >
          {icons[toast.type] || icons.info}
          <p className="text-sm">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
