import React from 'react';
import { Link } from 'react-router-dom';
import './TutorialCard.css';

const CATEGORY_ICONS = {
  HTML: '🌐',
  CSS: '🎨',
  JavaScript: '⚡',
  Java: '☕',
  'Node.js': '🟢',
  React: '⚛️',
  MongoDB: '🍃',
  Default: '📘',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function TutorialCard({ tutorial }) {
  const icon = CATEGORY_ICONS[tutorial.category_name] || CATEGORY_ICONS.Default;
  const excerpt = tutorial.content.replace(/[#*`>]/g, '').slice(0, 110) + '...';

  return (
    <Link to={`/tutorials/${tutorial._id}`} className="tutorial-card">
      <div className="tutorial-card-header">
        <span className="tutorial-cat-icon">{icon}</span>
        <span className="tag">{tutorial.category_name}</span>
      </div>

      <h3 className="tutorial-card-title">{tutorial.title}</h3>
      <p className="tutorial-card-excerpt">{excerpt}</p>

      <div className="tutorial-card-footer">
        <span className="tutorial-meta">
          <span className="tutorial-author">
            {tutorial.user_id?.name || 'Admin'}
          </span>
          <span className="dot">·</span>
          <span>{timeAgo(tutorial.createdAt)}</span>
        </span>
        <span className="tutorial-views">👁 {tutorial.views}</span>
      </div>

      {tutorial.tags?.length > 0 && (
        <div className="tutorial-tags">
          {tutorial.tags.slice(0, 3).map((t, i) => (
            <span key={i} className="tag">{t.tag_name}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
