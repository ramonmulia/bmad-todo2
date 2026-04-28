export function SearchInput({ value, onChange }) {
  return (
    <input
      type="search"
      className="search-input"
      placeholder="Search todos..."
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label="Search todos"
    />
  );
}
