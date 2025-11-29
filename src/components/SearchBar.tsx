import React from 'react';
import '../styles/SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search todos...',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={placeholder}
          onChange={handleChange}
          className="search-input"
          title="Search todos by title or description (Ctrl+F)"
        />
      </div>
      <button
        onClick={handleClear}
        className="search-clear-btn"
        title="Clear search"
      >
        ✕
      </button>
    </div>
  );
};
