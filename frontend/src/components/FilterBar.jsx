export function FilterBar({ currentFilter, onFilterChange }) {
  const filters = ['all', 'active', 'completed'];

  return (
    <div className="filter-bar" role="group" aria-label="Filter todos">
      {filters.map(filter => (
        <button
          key={filter}
          className={`filter-btn${currentFilter === filter ? ' filter-btn--active' : ''}`}
          onClick={() => onFilterChange(filter)}
          aria-pressed={currentFilter === filter}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
}
