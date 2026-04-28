import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo } from '../db/database.js';
import { validateTodoCreate, validateTodoUpdate, sanitizeHtml } from '../middleware/validation.js';

const router = Router();

// GET /api/todos
router.get('/', (req, res) => {
  try {
    const { status } = req.query;
    const validStatuses = ['all', 'active', 'completed'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: `Invalid status filter. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    let todos = getAllTodos();

    if (status === 'active') {
      todos = todos.filter(t => !t.completed);
    } else if (status === 'completed') {
      todos = todos.filter(t => t.completed);
    }

    res.json(todos);
  } catch (err) {
    console.error('GET /api/todos error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch todos' });
  }
});

// POST /api/todos
router.post('/', validateTodoCreate, (req, res) => {
  try {
    const now = new Date().toISOString();
    const todo = {
      id: uuidv4(),
      text: sanitizeHtml(req.body.text),
      completed: false,
      created_at: now,
      updated_at: now
    };
    createTodo(todo);
    res.status(201).json(todo);
  } catch (err) {
    console.error('POST /api/todos error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to create todo' });
  }
});

// PATCH /api/todos/:id
router.patch('/:id', validateTodoUpdate, (req, res) => {
  try {
    const existing = getTodoById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Todo not found' });
    }

    const updates = {};
    if (req.body.completed !== undefined) updates.completed = req.body.completed;
    if (req.body.text !== undefined) updates.text = sanitizeHtml(req.body.text);

    const updated = updateTodo(req.params.id, updates);
    res.json(updated);
  } catch (err) {
    console.error('PATCH /api/todos/:id error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  try {
    const existing = getTodoById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Todo not found' });
    }
    deleteTodo(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/todos/:id error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to delete todo' });
  }
});

export default router;
