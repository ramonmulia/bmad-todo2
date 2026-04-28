import fs from 'fs';
import path from 'path';

function getDbPath() {
  return process.env.DB_PATH || path.join(process.cwd(), 'data', 'todos.json');
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function load() {
  const dbPath = getDbPath();
  ensureDir(dbPath);
  if (fs.existsSync(dbPath)) {
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  }
  const empty = { todos: [] };
  fs.writeFileSync(dbPath, JSON.stringify(empty, null, 2));
  return empty;
}

function save(data) {
  const dbPath = getDbPath();
  ensureDir(dbPath);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function getAllTodos() {
  const data = load();
  return [...data.todos].sort((a, b) =>
    new Date(b.created_at) - new Date(a.created_at)
  );
}

export function getTodoById(id) {
  const data = load();
  return data.todos.find(t => t.id === id) || null;
}

export function createTodo(todo) {
  const data = load();
  data.todos.push(todo);
  save(data);
  return todo;
}

export function updateTodo(id, updates) {
  const data = load();
  const idx = data.todos.findIndex(t => t.id === id);
  if (idx === -1) return null;
  data.todos[idx] = { ...data.todos[idx], ...updates, updated_at: new Date().toISOString() };
  save(data);
  return data.todos[idx];
}

export function deleteTodo(id) {
  const data = load();
  const idx = data.todos.findIndex(t => t.id === id);
  if (idx === -1) return false;
  data.todos.splice(idx, 1);
  save(data);
  return true;
}
