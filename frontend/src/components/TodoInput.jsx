import { useState } from 'react';

export function TodoInput({ onAdd }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    const success = await onAdd(trimmed);
    if (success) setText('');
    setSubmitting(false);
  };

  return (
    <form className="todo-input-form" onSubmit={handleSubmit} role="form" aria-label="Add todo">
      <input
        className="todo-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        maxLength={500}
        disabled={submitting}
        aria-label="New todo text"
        autoFocus
      />
      <button
        className="todo-input-btn"
        type="submit"
        disabled={!text.trim() || submitting}
        aria-label="Add todo"
      >
        {submitting ? '...' : 'Add'}
      </button>
    </form>
  );
}
