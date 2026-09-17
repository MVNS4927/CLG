import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMoon, FiSun, FiSearch } from 'react-icons/fi';
import { useApp } from '../state/AppContext';
import logo from '/logo.png';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/buy', label: 'Buy' },
  { to: '/sell', label: 'Sell' },
  { to: '/rent/browse', label: 'Rent' },
  { to: '/profile', label: 'Profile' }
];

export default function Navbar() {
  const { user, logout, theme, setTheme, setGlobalQuery } = useApp();
  const navigate = useNavigate();

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md pb-2 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="section">
        <div className="mt-4 mb-3 p-[2px] rounded-2xl bg-gradient-to-r from-brand-100 via-white to-brand-100 shadow-lg">
          <div className="px-4 py-3 md:px-6 md:py-4 bg-white dark:bg-gray-950 rounded-2xl flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="CLG Space logo"
              className="h-14 w-14 sm:h-16 sm:w-16 md:h-16 md:w-16 object-contain drop-shadow-md transform origin-left"
              style={{ transform: 'scale(1.35)', transformOrigin: 'left center' }}
            />
            <div>
              <Link to="/" className="text-2xl font-bold tracking-tight">
                CLG Space
              </Link>
              <p className="subtle hidden sm:block text-base">Campus-only marketplace</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm transition border border-transparent hover:border-brand-200 ${
                    isActive
                      ? 'text-brand-800 border-b-2 border-b-accent-orange font-semibold'
                      : 'text-gray-600 hover:text-brand-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-end">
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                onChange={(e) => setGlobalQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-brand-100 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-brand-400"
                placeholder="Search across CLG Space"
              />
            </div>
            <button onClick={toggleTheme} className="btn-ghost rounded-full h-10 w-10">
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate('/auth');
                }}
                className="btn-primary px-3 py-2"
              >
                Logout
              </button>
            ) : (
              <Link to="/auth" className="btn-primary px-3 py-2">
                Login
              </Link>
            )}
          </div>
          <div className="lg:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="btn-ghost rounded-full h-10 w-10">
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate('/auth');
                }}
                className="btn-primary px-3 py-2"
              >
                Logout
              </button>
            ) : (
              <Link to="/auth" className="btn-primary px-3 py-2">
                Login
              </Link>
            )}
          </div>
          </div>
        </div>
        <div className="md:hidden card px-3 py-2 flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm whitespace-nowrap ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200' : 'text-gray-600'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
