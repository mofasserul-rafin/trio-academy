import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TutorialCard from '../components/TutorialCard';
import SearchBar from '../components/SearchBar';
import './Home.css';

const CATEGORIES = [
  { name: 'HTML', icon: '🌐', color: '#e34f26' },
  { name: 'CSS', icon: '🎨', color: '#1572b6' },
  { name: 'JavaScript', icon: '⚡', color: '#f7df1e' },
  { name: 'Java', icon: '☕', color: '#ff6b35' },
  { name: 'Node.js', icon: '🟢', color: '#339933' },
  { name: 'React', icon: '⚛️', color: '#61dafb' },
];

export default function Home() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/tutorials/latest')
      .then((res) => setTutorials(res.data.tutorials))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (query) => {
    if (query) navigate(`/tutorials?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span>✦</span> Free learning platform
          </div>
          <h1 className="hero-title">
            Learn to Code.<br />
            <span className="hero-accent">Build the Future.</span>
          </h1>
          <p className="hero-subtitle">
            Master HTML, CSS, JavaScript, Java, Node.js and more with clear,
            practical tutorials designed for every level.
          </p>
          <div className="hero-search">
            <SearchBar onSearch={handleSearch} placeholder="Search any topic..." />
          </div>
          <div className="hero-actions">
            <Link to="/tutorials" className="btn btn-primary">
              Browse All Tutorials →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Browse by Topic</h2>
            <Link to="/tutorials" className="see-all">See all →</Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/tutorials?category=${cat.name}`}
                className="category-chip"
                style={{ '--cat-color': cat.color }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest tutorials */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Tutorials</h2>
            <Link to="/tutorials" className="see-all">View all →</Link>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : tutorials.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📚</div>
              <h3>No tutorials yet</h3>
              <p>Check back soon — content is being added!</p>
            </div>
          ) : (
            <div className="tutorials-grid fade-in">
              {tutorials.map((t) => (
                <TutorialCard key={t._id} tutorial={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-inner">
            <div>
              <h2>Ready to start learning?</h2>
              <p>Explore our full library of programming tutorials.</p>
            </div>
            <Link to="/tutorials" className="btn btn-primary">
              Start Learning →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
