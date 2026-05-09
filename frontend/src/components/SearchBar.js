import React, { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch, placeholder = 'Search tutorials...' }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button type="button" className="search-clear" onClick={handleClear}>✕</button>
      )}
      <button type="submit" className="btn btn-primary btn-sm search-btn">
        Search
      </button>
    </form>
  );
}
