import { useEffect, useMemo, useState } from 'react';
import { useTodos } from './hooks/useTodos';
import type { FilterType } from './hooks/useTodos';
import { useTheme } from './context/ThemeContext';
import { TodoItem } from './components/TodoItem';
import { AddTodoForm } from './components/AddTodoForm';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import './App.css';

function App() {
  const {
    todos,
    addTodo,
    deleteTodo,
    toggleComplete,
    getTodosByFilter,
    searchTodos,
    getTodosByCategory,
    getCategories,
  } = useTodos();

  const { isDark, toggleTheme } = useTheme();

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+N: Add new todo
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        document.querySelector('.add-todo-trigger')?.dispatchEvent(new Event('click', { bubbles: true }));
      }
      // Ctrl+D: Toggle dark mode
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleTheme]);

  const categories = getCategories();

  // Filter todos based on current filters
  const filteredTodos = useMemo(() => {
    let result = getTodosByFilter(filter);

    if (selectedCategory) {
      result = result.filter(todo => todo.category === selectedCategory);
    }

    if (searchQuery) {
      const searchResults = searchTodos(searchQuery);
      result = result.filter(todo => searchResults.some(t => t.id === todo.id));
    }

    return result;
  }, [filter, selectedCategory, searchQuery, getTodosByFilter, searchTodos, todos]);

  const activeTodosCount = getTodosByFilter('active').length;
  const completedTodosCount = getTodosByFilter('completed').length;

  const categoryTodoCount = (category: string) => {
    return getTodosByCategory(category).filter(
      todo => !searchQuery || searchTodos(searchQuery).some(t => t.id === todo.id)
    ).length;
  };

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div className="header-content">
          <h1>Todo List Application</h1>
          <div className="header-actions">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              title="Toggle dark mode (Ctrl+D)"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="app-container">
          <aside className="app-sidebar">
            <div className="filters-section">
              <h2>Filters</h2>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All <span className="count">{todos.length}</span>
                </button>
                <button
                  className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                  onClick={() => setFilter('active')}
                >
                  Active <span className="count">{activeTodosCount}</span>
                </button>
                <button
                  className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed <span className="count">{completedTodosCount}</span>
                </button>
              </div>
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              allCount={getTodosByFilter(filter).length}
              categoryCount={categoryTodoCount}
            />
          </aside>

          <section className="app-content">
            <div className="content-header">
              <AddTodoForm categories={categories} onAdd={addTodo} />
              <SearchBar onSearch={setSearchQuery} />
            </div>

            <div className="todo-list">
              {filteredTodos.length === 0 ? (
                <div className="empty-state">
                  <p>
                    {searchQuery
                      ? `No todos found matching "${searchQuery}"`
                      : 'No todos yet. Add one to get started!'}
                  </p>
                </div>
              ) : (
                filteredTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleComplete}
                    onDelete={deleteTodo}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>Made by <strong>Premdeep T</strong></p>
        <p>
          <a href="https://github.com/yourname/todo-app" target="_blank" rel="noopener noreferrer">
            GitHub Project
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
