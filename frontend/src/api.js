const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  getTodos: () => request('/todos'),
  createTodo: (text) => request('/todos', {
    method: 'POST',
    body: JSON.stringify({ text })
  }),
  updateTodo: (id, updates) => request(`/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  }),
  deleteTodo: (id) => request(`/todos/${id}`, {
    method: 'DELETE'
  })
};
