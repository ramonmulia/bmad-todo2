import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../api.js';

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (text) => {
    try {
      setError(null);
      const newTodo = await api.createTodo(text);
      setTodos(prev => [newTodo, ...prev]);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to add todo');
      return false;
    }
  }, []);

  const toggleTodo = useCallback(async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    // Optimistic update
    setTodos(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );

    try {
      setError(null);
      await api.updateTodo(id, { completed: !todo.completed });
    } catch (err) {
      // Revert on failure
      setTodos(prev =>
        prev.map(t => t.id === id ? { ...t, completed: todo.completed } : t)
      );
      setError(err.message || 'Failed to update todo');
    }
  }, [todos]);

  const removeTodo = useCallback(async (id) => {
    const prevTodos = todos;

    // Optimistic update
    setTodos(prev => prev.filter(t => t.id !== id));

    try {
      setError(null);
      await api.deleteTodo(id);
    } catch (err) {
      // Revert on failure
      setTodos(prevTodos);
      setError(err.message || 'Failed to delete todo');
    }
  }, [todos]);

  const dismissError = useCallback(() => setError(null), []);

  const filteredTodos = useMemo(() => {
    let result = todos;
    if (filter === 'active') result = result.filter(t => !t.completed);
    if (filter === 'completed') result = result.filter(t => t.completed);
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(t => t.text.toLowerCase().includes(query));
    }
    return result;
  }, [todos, filter, searchQuery]);

  return { todos, filteredTodos, filter, setFilter, searchQuery, setSearchQuery, loading, error, addTodo, toggleTodo, removeTodo, dismissError };
}
