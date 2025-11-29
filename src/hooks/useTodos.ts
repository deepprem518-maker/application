import { useCallback, useEffect, useState } from 'react';

export interface Todo {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

export type FilterType = 'all' | 'active' | 'completed';

const STORAGE_KEY = 'todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((todo: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);
    return newTodo;
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const getTodosByFilter = useCallback((filter: FilterType): Todo[] => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos]);

  const searchTodos = useCallback((query: string): Todo[] => {
    const lowerQuery = query.toLowerCase();
    return todos.filter(
      todo =>
        todo.title.toLowerCase().includes(lowerQuery) ||
        todo.description.toLowerCase().includes(lowerQuery)
    );
  }, [todos]);

  const getTodosByCategory = useCallback((category: string): Todo[] => {
    return todos.filter(todo => todo.category === category);
  }, [todos]);

  const getCategories = useCallback((): string[] => {
    const categories = new Set(todos.map(todo => todo.category));
    return Array.from(categories).sort();
  }, [todos]);

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    getTodosByFilter,
    searchTodos,
    getTodosByCategory,
    getCategories,
  };
};
