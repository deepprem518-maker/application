import React from 'react';
import '../styles/CategoryFilter.css';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  allCount: number;
  categoryCount: (category: string) => number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  allCount,
  categoryCount,
}) => {
  return (
    <div className="category-filter">
      <h3 className="filter-title">Categories</h3>
      <div className="category-list">
        <button
          className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => onCategoryChange(null)}
          title="Show all todos"
        >
          All
          <span className="category-count">{allCount}</span>
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
            title={`Show ${category} todos`}
          >
            <span className="category-icon">
              {getCategoryIcon(category)}
            </span>
            {category}
            <span className="category-count">{categoryCount(category)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    work: '💼',
    personal: '👤',
    shopping: '🛒',
    health: '🏥',
    finance: '💰',
    other: '📌',
  };
  return icons[category.toLowerCase()] || '📌';
}
