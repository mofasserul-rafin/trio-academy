import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

const CATEGORIES = ['HTML', 'CSS', 'JavaScript', 'Java', 'Node.js', 'React', 'MongoDB', 'Other'];
const TABS = ['Dashboard', 'Tutorials', 'Categories', 'Users'];

// ── Stats card ──────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card" style={{ '--stat-color': color }}>
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-value">{value ?? '—'}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

// ── Tutorial form ────────────────────────────────────────────────────────────
function TutorialForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || { title: '', content: '', category_name: '', tags: '' }
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.category_name) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        content: form.content,
        category_name: form.category_name,
        tags: form.tags
          ? form.tags.split(',').map((t) => ({ tag_name: t.trim() })).filter((t) => t.tag_name)
          : [],
      };
      if (initial?._id) {
        await axios.put(`/api/tutorials/${initial._id}`, payload);
        toast.success('Tutorial updated!');
      } else {
        await axios.post('/api/tutorials', payload);
        toast.success('Tutorial created!');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-panel fade-in">
      <div className="form-panel-header">
        <h2>{initial?._id ? 'Edit Tutorial' : 'New Tutorial'}</h2>
        <button className="btn btn-outline btn-sm" onClick={onCancel}>✕ Cancel</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            name="title"
            className="form-input"
            value={form.title}
            onChange={handleChange}
            placeholder="Tutorial title"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            name="category_name"
            className="form-select"
            value={form.category_name}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Tags (comma separated)</label>
          <input
            name="tags"
            className="form-input"
            value={form.tags}
            onChange={handleChange}
            placeholder="html, web, beginner"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Content * (supports Markdown-like syntax)</label>
          <textarea
            name="content"
            className="form-textarea"
            value={form.content}
            onChange={handleChange}
            placeholder="Write your tutorial content here...&#10;&#10;## Introduction&#10;&#10;Use ## for headings, **bold** for emphasis."
            style={{ minHeight: 280 }}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : initial?._id ? '✓ Update Tutorial' : '+ Publish Tutorial'}
          </button>
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

// ── Main AdminPanel ──────────────────────────────────────────────────────────
export default function AdminPanel() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editTutorial, setEditTutorial] = useState(null);
  const [catForm, setCatForm] = useState({ category_name: '', description: '', icon: '' });

  // Support ?edit=id from TutorialDetail
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      axios.get(`/api/tutorials/${editId}`).then((res) => {
        const t = res.data.tutorial;
        setEditTutorial({
          ...t,
          tags: t.tags?.map((tg) => tg.tag_name).join(', ') || '',
        });
        setShowForm(true);
        setActiveTab('Tutorials');
      });
    }
  }, [searchParams]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setStats(res.data.stats);
    } catch {}
  }, []);

  const fetchTutorials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/tutorials?limit=50');
      setTutorials(res.data.tutorials);
    } catch {} finally { setLoading(false); }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data.categories);
    } catch {}
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data.users);
    } catch {}
  }, []);

  useEffect(() => { fetchStats(); fetchCategories(); }, [fetchStats, fetchCategories]);
  useEffect(() => {
    if (activeTab === 'Tutorials') fetchTutorials();
    if (activeTab === 'Users') fetchUsers();
  }, [activeTab, fetchTutorials, fetchUsers]);

  const handleDeleteTutorial = async (id) => {
    if (!window.confirm('Delete this tutorial?')) return;
    try {
      await axios.delete(`/api/tutorials/${id}`);
      toast.success('Deleted');
      fetchTutorials();
      fetchStats();
    } catch { toast.error('Failed to delete'); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed to delete user'); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catForm.category_name) { toast.error('Name required'); return; }
    try {
      await axios.post('/api/categories', catForm);
      toast.success('Category added');
      setCatForm({ category_name: '', description: '', icon: '' });
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`/api/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch { toast.error('Failed'); }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditTutorial(null);
    setSearchParams({});
    fetchTutorials();
    fetchStats();
  };

  return (
    <div className="admin-page">
      <div className="container">
        {/* Admin header */}
        <div className="admin-header">
          <div>
            <h1>Admin Panel</h1>
            <p className="admin-subheading">Welcome back, {user?.name} 👋</p>
          </div>
          {activeTab === 'Tutorials' && !showForm && (
            <button
              className="btn btn-primary"
              onClick={() => { setEditTutorial(null); setShowForm(true); }}
            >
              + New Tutorial
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setShowForm(false); setEditTutorial(null); }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD ── */}
        {activeTab === 'Dashboard' && (
          <div className="fade-in">
            <div className="stats-grid">
              <StatCard icon="📚" label="Tutorials" value={stats?.totalTutorials} color="#ffb300" />
              <StatCard icon="📂" label="Categories" value={stats?.totalCategories} color="#00d4aa" />
              <StatCard icon="👥" label="Users" value={stats?.totalUsers} color="#a78bfa" />
              <StatCard icon="👁" label="Total Views" value={stats?.totalViews} color="#38bdf8" />
            </div>
            <div className="dashboard-tip card">
              <h3>Quick Tips</h3>
              <ul>
                <li>Go to <strong>Tutorials</strong> tab to add, edit or delete tutorials.</li>
                <li>Go to <strong>Categories</strong> tab to manage topic categories.</li>
                <li>Go to <strong>Users</strong> tab to see all registered users.</li>
                <li>Use the <strong>search bar</strong> on the Tutorials page to find content fast.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── TUTORIALS ── */}
        {activeTab === 'Tutorials' && (
          <div className="fade-in">
            {showForm ? (
              <TutorialForm
                initial={editTutorial}
                onSave={handleFormSave}
                onCancel={() => { setShowForm(false); setEditTutorial(null); setSearchParams({}); }}
              />
            ) : loading ? (
              <div className="spinner" />
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Views</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tutorials.length === 0 && (
                      <tr><td colSpan="5" className="table-empty">No tutorials yet. Add one above!</td></tr>
                    )}
                    {tutorials.map((t) => (
                      <tr key={t._id}>
                        <td className="table-title">{t.title}</td>
                        <td><span className="tag">{t.category_name}</span></td>
                        <td>{t.views}</td>
                        <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td className="table-actions">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              setEditTutorial({
                                ...t,
                                tags: t.tags?.map((tg) => tg.tag_name).join(', ') || '',
                              });
                              setShowForm(true);
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteTutorial(t._id)}
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── CATEGORIES ── */}
        {activeTab === 'Categories' && (
          <div className="fade-in">
            <div className="cat-layout">
              {/* Add form */}
              <div className="card">
                <h3 style={{ marginBottom: 20 }}>Add Category</h3>
                <form onSubmit={handleAddCategory}>
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input
                      className="form-input"
                      value={catForm.category_name}
                      onChange={(e) => setCatForm((f) => ({ ...f, category_name: e.target.value }))}
                      placeholder="e.g. JavaScript"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <input
                      className="form-input"
                      value={catForm.description}
                      onChange={(e) => setCatForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Brief description"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Icon (emoji)</label>
                    <input
                      className="form-input"
                      value={catForm.icon}
                      onChange={(e) => setCatForm((f) => ({ ...f, icon: e.target.value }))}
                      placeholder="⚡"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    + Add Category
                  </button>
                </form>
              </div>

              {/* Category list */}
              <div>
                {categories.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No categories yet.</p>
                ) : (
                  <div className="cat-list">
                    {categories.map((cat) => (
                      <div key={cat._id} className="cat-item">
                        <span className="cat-item-icon">{cat.icon || '📂'}</span>
                        <div className="cat-item-info">
                          <span className="cat-item-name">{cat.category_name}</span>
                          {cat.description && (
                            <span className="cat-item-desc">{cat.description}</span>
                          )}
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCategory(cat._id)}
                        >
                          🗑
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === 'Users' && (
          <div className="fade-in admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr><td colSpan="5" className="table-empty">No users found.</td></tr>
                )}
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{u.email}</td>
                    <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="table-actions">
                      {u._id !== user?._id && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          🗑
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
