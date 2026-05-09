import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If already logged in as admin, redirect
  if (isAdmin) {
    navigate('/admin', { replace: true });
  }

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin') {
        toast.error('Access denied. Admin accounts only.');
        return;
      }
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb" />
      </div>

      <div className="login-card fade-in">
        <div className="login-logo">
          <span>▲</span>
        </div>
        <h1 className="login-title">Admin Login</h1>
        <p className="login-subtitle">Sign in to manage Trio Academy content</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/" className="btn btn-outline btn-sm">
            ← Back to Home
          </Link>
        </div>

        <div className="login-hint">
          <p>
            <strong>First time?</strong> Create an admin account via{' '}
            <code>POST /api/auth/register</code> with <code>"role": "admin"</code>
          </p>
        </div>
      </div>
    </div>
  );
}
