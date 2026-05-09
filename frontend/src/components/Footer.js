import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span>▲</span> TrioAcademy
          </Link>
          <p className="footer-tagline">
            Learn modern web technologies, one tutorial at a time.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Navigate</h4>
            <Link to="/">Home</Link>
            <Link to="/tutorials">Tutorials</Link>
            <Link to="/admin/login">Admin</Link>
          </div>
          <div className="footer-col">
            <h4>Topics</h4>
            <Link to="/tutorials?category=HTML">HTML</Link>
            <Link to="/tutorials?category=CSS">CSS</Link>
            <Link to="/tutorials?category=JavaScript">JavaScript</Link>
            <Link to="/tutorials?category=Node.js">Node.js</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>
            © 2026 Trio Academy · CSE 14th (B) · CCN University of Science & Technology
          </p>
          <p className="footer-credits">
            Built by <span>Data Miners</span> — Bakia, Rafin & Munem
          </p>
        </div>
      </div>
    </footer>
  );
}
