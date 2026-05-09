import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import TutorialCard from '../components/TutorialCard';
import SearchBar from '../components/SearchBar';
import './Tutorials.css';

const CATEGORIES = ['All', 'HTML', 'CSS', 'JavaScript', 'Java', 'Node.js', 'React', 'MongoDB'];

export default function Tutorials() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const fetchTutorials = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.append('search', search);
      if (category) params.append('category', category);

      const res = await axios.get(`/api/tutorials?${params}`);
      setTutorials(res.data.tutorials);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {
      setTutorials([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    fetchTutorials();
  }, [fetchTutorials]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, category]);

  const handleSearch = (q) => {
    const p = new URLSearchParams(searchParams);
    if (q) p.set('search', q); else p.delete('search');
    p.delete('category');
    setSearchParams(p);
  };

  const handleCategory = (cat) => {
    const p = new URLSearchParams();
    if (cat && cat !== 'All') p.set('category', cat);
    setSearchParams(p);
  };

  return (
    <div className="tutorials-page">
      <div className="container">
        {/* Page header */}
        <div className="page-header">
          <h1>All Tutorials</h1>
          <p className="tutorials-count">
            {total} tutorial{total !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Filters */}
        <div className="tutorials-toolbar">
          <SearchBar onSearch={handleSearch} />
          <div className="cat-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-filter-btn ${(cat === 'All' && !category) || cat === category ? 'active' : ''}`}
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Active filters display */}
        {(search || category) && (
          <div className="active-filters">
            <span>Showing results for:</span>
            {search && <span className="filter-pill">🔍 "{search}"</span>}
            {category && <span className="filter-pill">📂 {category}</span>}
            <button
              className="clear-filters"
              onClick={() => setSearchParams({})}
            >
              Clear all ✕
            </button>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="spinner" />
        ) : tutorials.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔎</div>
            <h3>No tutorials found</h3>
            <p>Try a different search term or category.</p>
          </div>
        ) : (
          <>
            <div className="tutorials-grid fade-in">
              {tutorials.map((t) => (
                <TutorialCard key={t._id} tutorial={t} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Prev
                </button>
                <span className="page-info">Page {page} of {pages}</span>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page >= pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
