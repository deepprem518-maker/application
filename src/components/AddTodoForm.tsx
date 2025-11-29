import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Todo } from '../hooks/useTodos';
import '../styles/AddTodoForm.css';

interface AddTodoFormProps {
  categories: string[];
  onAdd: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  dueDate: string;
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({ categories, onAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      category: categories[0] || 'personal',
      dueDate: '',
    },
  });

  const onSubmit = (data: FormData) => {
    onAdd({
      title: data.title,
      description: data.description,
      category: data.category,
      dueDate: data.dueDate,
      completed: false,
    });
    reset();
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        className="add-todo-trigger"
        onClick={() => setIsExpanded(true)}
        title="Add new todo (Ctrl+N)"
      >
        + Add New Todo
      </button>
    );
  }

  return (
    <form className="add-todo-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          placeholder="Enter todo title"
          {...register('title', {
            required: 'Title is required',
            minLength: { value: 1, message: 'Title cannot be empty' },
            maxLength: { value: 100, message: 'Title must be less than 100 characters' },
          })}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Enter todo description"
          maxLength={500}
          {...register('description', {
            maxLength: { value: 500, message: 'Description must be less than 500 characters' },
          })}
          rows={3}
          className={errors.description ? 'error' : ''}
        />
        {errors.description && (
          <span className="error-message">{errors.description.message}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            {...register('category', { required: 'Category is required' })}
            className={errors.category ? 'error' : ''}
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
          {errors.category && (
            <span className="error-message">{errors.category.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            {...register('dueDate')}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          Add Todo
        </button>
        <button
          type="button"
          className="btn-cancel"
          onClick={() => {
            setIsExpanded(false);
            reset();
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
