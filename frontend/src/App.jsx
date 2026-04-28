import { useTodos } from './hooks/useTodos.js';
import { TodoInput } from './components/TodoInput.jsx';
import { TodoItem } from './components/TodoItem.jsx';
import { FilterBar } from './components/FilterBar.jsx';
import { SearchInput } from './components/SearchInput.jsx';

export default function App() {
  const { todos, filteredTodos, filter, setFilter, searchQuery, setSearchQuery, loading, error, addTodo, toggleTodo, removeTodo, dismissError } = useTodos();

  const activeCount = todos.filter(t => !t.completed).length;

  const emptyMessage = searchQuery.trim()
    ? 'No todos match your search'
    : filter === 'active'
      ? 'No active todos'
      : 'No completed todos';

  return (
    <main>
      <header className="app-header">
        <h1 className="app-title">
          <span className="dot" aria-hidden="true" />
          todos
        </h1>
        <p className="app-subtitle">Keep track of what matters.</p>
      </header>

      <TodoInput onAdd={addTodo} />

      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button onClick={dismissError} aria-label="Dismiss error">✕</button>
        </div>
      )}

      {loading ? (
        <div className="loading" aria-label="Loading todos">
          <div className="spinner" />
        </div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">📋</div>
          <p className="empty-title">No todos yet</p>
          <p className="empty-description">Add one above to get started.</p>
        </div>
      ) : (
        <>
          <p className="todo-counter">
            {activeCount} active · {todos.length} total
          </p>
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          {filteredTodos.length === 0 ? (
            <p className="filter-empty">{emptyMessage}</p>
          ) : (
            <ul className="todo-list" aria-label="Todo list">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={removeTodo}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
