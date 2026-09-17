import logo from '/logo.png';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-brand-50 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
      <div className="section py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="CLG Space logo"
            className="h-8 w-8 object-contain drop-shadow-sm transform"
            style={{ transform: 'scale(1.35)', transformOrigin: 'center' }}
          />
          <p className="text-sm text-gray-500">CLG Space • Campus-only marketplace</p>
        </div>
        <p className="text-xs text-gray-400">Made for students • {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
