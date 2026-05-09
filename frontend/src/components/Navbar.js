import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) =>
    location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">▲</span>
          <span className="logo-text">Trio<span>Academy</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/tutorials" className={isActive('/tutorials')}>Tutorials</Link>
          {isAdmin && (
            <Link to="/admin" className={isActive('/admin')}>Admin Panel</Link>
          )}
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          {user ? (
            <div className="nav-user">
              <span className="nav-user-name">
                {isAdmin && <span className="badge badge-admin">Admin</span>}
                {user.name}
              </span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/admin/login" className="btn btn-primary btn-sm">
              Admin Login
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link">Home</Link>
          <Link to="/tutorials" className="mobile-link">Tutorials</Link>
          {isAdmin && <Link to="/admin" className="mobile-link">Admin Panel</Link>}
          {user ? (
            <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ width: '100%' }}>
              Logout
            </button>
          ) : (
            <Link to="/admin/login" className="btn btn-primary btn-sm" style={{ textAlign: 'center' }}>
              Admin Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
