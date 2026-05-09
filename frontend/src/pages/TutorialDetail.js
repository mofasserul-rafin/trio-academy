import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './TutorialDetail.css';

// Very simple markdown-like renderer
function renderContent(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
    if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
    if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>;
    if (line.startsWith('```')) return null;
    if (line.startsWith('> '))
      return <blockquote key={i}>{line.slice(2)}</blockquote>;
    if (line.trim() === '') return <br key={i} />;
    // Bold
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const formatted = parts.map((p, j) =>
      j % 2 === 1 ? <strong key={j}>{p}</strong> : p
    );
    return <p key={i}>{formatted}</p>;
  });
}

export default function TutorialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    axios.get(`/api/tutorials/${id}`)
      .then((res) => setTutorial(res.data.tutorial))
      .catch(() => toast.error('Tutorial not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this tutorial? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/tutorials/${id}`);
      toast.success('Tutorial deleted');
      navigate('/tutorials');
    } catch {
      toast.error('Failed to delete');
      setDeleting(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: 140 }} />;
  if (!tutorial) return (
    <div className="container" style={{ paddingTop: 120, textAlign: 'center' }}>
      <h2>Tutorial not found</h2>
      <Link to="/tutorials" className="btn btn-primary" style={{ marginTop: 20 }}>
        ← Back to Tutorials
      </Link>
    </div>
  );

  return (
    <div className="detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/tutorials">Tutorials</Link>
          <span>/</span>
          <span>{tutorial.category_name}</span>
        </nav>

        <div className="detail-layout">
          {/* Main content */}
          <article className="detail-article fade-in">
            <header className="detail-header">
              <span className="tag">{tutorial.category_name}</span>
              <h1 className="detail-title">{tutorial.title}</h1>

              <div className="detail-meta">
                <span>✍️ {tutorial.user_id?.name || 'Admin'}</span>
                <span>·</span>
                <span>👁 {tutorial.views} views</span>
                <span>·</span>
                <span>{new Date(tutorial.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}</span>
              </div>

              {isAdmin && (
                <div className="detail-admin-actions">
                  <Link to={`/admin?edit=${id}`} className="btn btn-outline btn-sm">
                    ✏️ Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : '🗑 Delete'}
                  </button>
                </div>
              )}
            </header>

            <div className="detail-content">
              {renderContent(tutorial.content)}
            </div>

            {tutorial.tags?.length > 0 && (
              <div className="detail-tags">
                <span className="detail-tags-label">Tags:</span>
                {tutorial.tags.map((t, i) => (
                  <span key={i} className="tag">{t.tag_name}</span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            <div className="sidebar-card">
              <h3>About this Tutorial</h3>
              <div className="sidebar-row">
                <span>Category</span>
                <span className="tag">{tutorial.category_name}</span>
              </div>
              <div className="sidebar-row">
                <span>Author</span>
                <span>{tutorial.user_id?.name || 'Admin'}</span>
              </div>
              <div className="sidebar-row">
                <span>Views</span>
                <span>{tutorial.views}</span>
              </div>
              <div className="sidebar-row">
                <span>Published</span>
                <span>{new Date(tutorial.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <Link to="/tutorials" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              ← Browse More
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
