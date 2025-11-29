import React from 'react';
import type { Todo } from '../hooks/useTodos';
import '../styles/TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const dueDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No date';

  const isOverdue =
    !todo.completed &&
    todo.dueDate &&
    new Date(todo.dueDate) < new Date();

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
          title="Mark as complete"
        />
        <div className="todo-details">
          <h3 className="todo-title">{todo.title}</h3>
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}
          <div className="todo-meta">
            <span className="todo-category">{todo.category}</span>
            <span className={`todo-date ${isOverdue ? 'overdue' : ''}`}>
              {dueDate}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="todo-delete-btn"
        title="Delete todo"
      >
        ✕
      </button>
    </div>
  );
};
