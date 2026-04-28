import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App.jsx';
import { TodoInput } from '../src/components/TodoInput.jsx';
import { TodoItem } from '../src/components/TodoItem.jsx';
import { FilterBar } from '../src/components/FilterBar.jsx';
import { SearchInput } from '../src/components/SearchInput.jsx';

// Mock the API
vi.mock('../src/api.js', () => ({
  api: {
    getTodos: vi.fn(),
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn()
  }
}));

import { api } from '../src/api.js';

describe('TodoInput', () => {
  it('renders input and button', () => {
    render(<TodoInput onAdd={vi.fn()} />);
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
  });

  it('button is disabled when input is empty', () => {
    render(<TodoInput onAdd={vi.fn()} />);
    expect(screen.getByRole('button', { name: /add todo/i })).toBeDisabled();
  });

  it('calls onAdd with trimmed text on submit', async () => {
    const onAdd = vi.fn().mockResolvedValue(true);
    render(<TodoInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: '  New todo  ' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => expect(onAdd).toHaveBeenCalledWith('New todo'));
  });

  it('clears input after successful add', async () => {
    const onAdd = vi.fn().mockResolvedValue(true);
    render(<TodoInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => expect(input.value).toBe(''));
  });
});

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    text: 'Test todo',
    completed: false,
    created_at: new Date().toISOString()
  };

  it('renders todo text', () => {
    render(
      <ul>
        <TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
      </ul>
    );
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('shows checkbox unchecked for active todo', () => {
    render(
      <ul>
        <TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
      </ul>
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('shows checkbox checked for completed todo', () => {
    render(
      <ul>
        <TodoItem todo={{ ...mockTodo, completed: true }} onToggle={vi.fn()} onDelete={vi.fn()} />
      </ul>
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onToggle when checkbox clicked', () => {
    const onToggle = vi.fn();
    render(
      <ul>
        <TodoItem todo={mockTodo} onToggle={onToggle} onDelete={vi.fn()} />
      </ul>
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn();
    render(
      <ul>
        <TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={onDelete} />
      </ul>
    );
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});

describe('FilterBar', () => {
  it('renders three filter buttons', () => {
    render(<FilterBar currentFilter="all" onFilterChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Completed' })).toBeInTheDocument();
  });

  it('highlights the active filter with aria-pressed', () => {
    render(<FilterBar currentFilter="active" onFilterChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onFilterChange when a button is clicked', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar currentFilter="all" onFilterChange={onFilterChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Completed' }));
    expect(onFilterChange).toHaveBeenCalledWith('completed');
  });

  it('has keyboard-accessible buttons', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar currentFilter="all" onFilterChange={onFilterChange} />);
    const activeBtn = screen.getByRole('button', { name: 'Active' });
    activeBtn.focus();
    expect(document.activeElement).toBe(activeBtn);
  });
});

describe('SearchInput', () => {
  it('renders search input with placeholder', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search todos...')).toBeInTheDocument();
  });

  it('has accessible label', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Search todos')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Search todos'), { target: { value: 'grocery' } });
    expect(onChange).toHaveBeenCalledWith('grocery');
  });
});

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    api.getTodos.mockReturnValue(new Promise(() => {})); // never resolves
    render(<App />);
    expect(screen.getByLabelText('Loading todos')).toBeInTheDocument();
  });

  it('shows empty state when no todos', async () => {
    api.getTodos.mockResolvedValue([]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('No todos yet')).toBeInTheDocument();
    });
  });

  it('renders todos from API', async () => {
    api.getTodos.mockResolvedValue([
      { id: '1', text: 'First', completed: false, created_at: new Date().toISOString() },
      { id: '2', text: 'Second', completed: true, created_at: new Date().toISOString() }
    ]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  it('shows error banner on API failure', async () => {
    api.getTodos.mockRejectedValue(new Error('Network error'));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('displays the app title', async () => {
    api.getTodos.mockResolvedValue([]);
    render(<App />);
    expect(screen.getByText('todos')).toBeInTheDocument();
  });

  it('shows filter bar when todos exist', async () => {
    api.getTodos.mockResolvedValue([
      { id: '1', text: 'First', completed: false, created_at: new Date().toISOString() },
      { id: '2', text: 'Second', completed: true, created_at: new Date().toISOString() }
    ]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    });
  });

  it('filters to active todos only', async () => {
    api.getTodos.mockResolvedValue([
      { id: '1', text: 'Active todo', completed: false, created_at: new Date().toISOString() },
      { id: '2', text: 'Done todo', completed: true, created_at: new Date().toISOString() }
    ]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Active todo')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Active' }));
    expect(screen.getByText('Active todo')).toBeInTheDocument();
    expect(screen.queryByText('Done todo')).not.toBeInTheDocument();
  });

  it('filters to completed todos only', async () => {
    api.getTodos.mockResolvedValue([
      { id: '1', text: 'Active todo', completed: false, created_at: new Date().toISOString() },
      { id: '2', text: 'Done todo', completed: true, created_at: new Date().toISOString() }
    ]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Active todo')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Completed' }));
    expect(screen.queryByText('Active todo')).not.toBeInTheDocument();
    expect(screen.getByText('Done todo')).toBeInTheDocument();
  });

  it('shows All todos when All filter clicked', async () => {
    api.getTodos.mockResolvedValue([
      { id: '1', text: 'Active todo', completed: false, created_at: new Date().toISOString() },
      { id: '2', text: 'Done todo', completed: true, created_at: new Date().toISOString() }
    ]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Active todo')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Completed' }));
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText('Active todo')).toBeInTheDocument();
    expect(screen.getByText('Done todo')).toBeInTheDocument();
  });

  it('shows contextual empty message when filter matches nothing', async () => {
    api.getTodos.mockResolvedValue([
      { id: '1', text: 'Active todo', completed: false, created_at: new Date().toISOString() }
    ]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Active todo')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Completed' }));
    expect(screen.getByText('No completed todos')).toBeInTheDocument();
  });

  it('filters todos by search text', async () => {
    api.getTodos.mockResolvedValue([
      { id: '1', text: 'Buy groceries', completed: false, created_at: new Date().toISOString() },
      { id: '2', text: 'Walk the dog', completed: false, created_at: new Date().toISOString() }
    ]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText('Search todos'), { target: { value: 'grocer' } });
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.queryByText('Walk the dog')).not.toBeInTheDocument();
  });

  it('shows empty message when search matches nothing', async () => {
    api.getTodos.mockResolvedValue([
      { id: '1', text: 'Buy groceries', completed: false, created_at: new Date().toISOString() }
    ]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText('Search todos'), { target: { value: 'zzzzz' } });
    expect(screen.getByText('No todos match your search')).toBeInTheDocument();
  });

  it('combines search with status filter', async () => {
    api.getTodos.mockResolvedValue([
      { id: '1', text: 'Buy groceries', completed: false, created_at: new Date().toISOString() },
      { id: '2', text: 'Buy milk', completed: true, created_at: new Date().toISOString() }
    ]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Active' }));
    fireEvent.change(screen.getByLabelText('Search todos'), { target: { value: 'buy' } });
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
  });

  it('shows "No active todos" when active filter matches nothing', async () => {
    api.getTodos.mockResolvedValue([
      { id: '1', text: 'Done todo', completed: true, created_at: new Date().toISOString() }
    ]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Done todo')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Active' }));
    expect(screen.getByText('No active todos')).toBeInTheDocument();
  });
});
