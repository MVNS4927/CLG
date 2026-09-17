import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLock, FiUser } from 'react-icons/fi';
import { useApp } from '../state/AppContext';
import { api } from '../utils/api';
import logo from '/logo.png';

const streams = ['Engineering', 'Medical'];

export default function LoginRegister() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    college: '',
    collegeId: '',
    name: '',
    email: '',
    password: '',
    stream: streams[0]
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, user } = useApp();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const validate = () => {
    const next = {};
    if (!form.college) next.college = 'Required';
    if (!form.collegeId) next.collegeId = 'Required';
    if (!form.email) next.email = 'Required';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (mode === 'register' && form.password.length < 6) next.password = 'Minimum 6 characters';
    if (!form.password) next.password = 'Required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});
    try {
      const account = mode === 'register' ? await api.register(form) : await api.login(form);
      await login(account);
      navigate('/');
    } catch (error) {
      setErrors({ form: error.message || 'Authentication failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const toggle = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setErrors({});
  };

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="section flex items-center justify-center py-10">
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="CLG Space logo"
              className="h-20 w-20 object-contain drop-shadow transform"
              style={{ transform: 'scale(1.4)', transformOrigin: 'left center' }}
            />
            <div>
              <p className="text-sm text-gray-500">Welcome to</p>
              <h1 className="text-3xl font-bold">CLG Space</h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Campus-only marketplace to buy, sell, or rent essentials instantly. Stay verified with your college ID and connect securely.
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="card p-4">
              <p className="text-gray-500">Verified Community</p>
              <p className="font-semibold mt-1">Only your campus peers</p>
            </div>
            <div className="card p-4">
              <p className="text-gray-500">Instant Chats</p>
              <p className="font-semibold mt-1">WhatsApp-style DM</p>
            </div>
          </div>
        </div>
        <div className="card p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="subtle">{mode === 'login' ? 'Sign in' : 'Create account'}</p>
              <h2 className="heading">Access CLG Space</h2>
            </div>
            <button onClick={toggle} className="btn-ghost text-sm">
              {mode === 'login' ? 'New here? Register' : 'Have an account? Login'}
            </button>
          </div>
          <form className="space-y-4" onSubmit={submit}>
            {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
            <div>
              <label className="text-sm font-semibold">College Name*</label>
              <input
                value={form.college}
                onChange={(e) => set('college', e.target.value)}
                className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                placeholder="Your College"
              />
              {errors.college && <p className="text-xs text-amber-600 mt-1">{errors.college}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold">College ID*</label>
                <input
                  value={form.collegeId}
                  onChange={(e) => set('collegeId', e.target.value)}
                  className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                  placeholder="ID / Roll No"
                />
                {errors.collegeId && <p className="text-xs text-amber-600 mt-1">{errors.collegeId}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold">Stream</label>
                <select
                  value={form.stream}
                  onChange={(e) => set('stream', e.target.value)}
                  className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                >
                  {streams.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold">Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className="w-full pl-9 mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                    placeholder="Your name"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold">Email {mode === 'register' && '*'}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                  placeholder="you@college.edu"
                />
                {errors.email && <p className="text-xs text-amber-600 mt-1">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">Password*</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className="w-full pl-9 mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                  placeholder="•••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-amber-600 mt-1">{errors.password}</p>}
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 mt-2 disabled:opacity-60">
              {submitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'} <FiArrowRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
