import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import path from 'path';
import os from 'os';
import fs from 'fs';

const testDbPath = path.join(os.tmpdir(), `todo-test-${Date.now()}.json`);
let request;

beforeAll(async () => {
  process.env.DB_PATH = testDbPath;
  const { createApp } = await import('../src/app.js');
  request = supertest(createApp());
});

beforeEach(() => {
  fs.writeFileSync(testDbPath, JSON.stringify({ todos: [] }));
});

describe('Health Check', () => {
  it('GET /api/health returns status ok', async () => {
    const res = await request.get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/todos', () => {
  it('returns empty array when no todos', async () => {
    const res = await request.get('/api/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns todos sorted newest first', async () => {
    await request.post('/api/todos').send({ text: 'First' });
    await new Promise(r => setTimeout(r, 20));
    await request.post('/api/todos').send({ text: 'Second' });

    const res = await request.get('/api/todos');
    expect(res.body).toHaveLength(2);
    expect(res.body[0].text).toBe('Second');
    expect(res.body[1].text).toBe('First');
  });
});

describe('GET /api/todos?status', () => {
  it('returns only active todos when status=active', async () => {
    await request.post('/api/todos').send({ text: 'Active one' });
    const created = await request.post('/api/todos').send({ text: 'Done one' });
    await request.patch(`/api/todos/${created.body.id}`).send({ completed: true });

    const res = await request.get('/api/todos?status=active');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].text).toBe('Active one');
  });

  it('returns only completed todos when status=completed', async () => {
    await request.post('/api/todos').send({ text: 'Active one' });
    const created = await request.post('/api/todos').send({ text: 'Done one' });
    await request.patch(`/api/todos/${created.body.id}`).send({ completed: true });

    const res = await request.get('/api/todos?status=completed');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].text).toBe('Done one');
  });

  it('returns all todos when status=all', async () => {
    await request.post('/api/todos').send({ text: 'Active one' });
    const created = await request.post('/api/todos').send({ text: 'Done one' });
    await request.patch(`/api/todos/${created.body.id}`).send({ completed: true });

    const res = await request.get('/api/todos?status=all');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('returns all todos when no status param', async () => {
    await request.post('/api/todos').send({ text: 'One' });
    await request.post('/api/todos').send({ text: 'Two' });

    const res = await request.get('/api/todos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('returns 400 for invalid status value', async () => {
    const res = await request.get('/api/todos?status=invalid');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(res.body.message).toContain('Invalid status filter');
  });

  it('returns empty array when no todos match filter', async () => {
    await request.post('/api/todos').send({ text: 'Active one' });

    const res = await request.get('/api/todos?status=completed');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/todos', () => {
  it('creates a todo and returns 201', async () => {
    const res = await request.post('/api/todos').send({ text: 'Buy groceries' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.text).toBe('Buy groceries');
    expect(res.body.completed).toBe(false);
    expect(res.body.created_at).toBeDefined();
  });

  it('rejects empty text with 400', async () => {
    const res = await request.post('/api/todos').send({ text: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('rejects missing text with 400', async () => {
    const res = await request.post('/api/todos').send({});
    expect(res.status).toBe(400);
  });

  it('rejects whitespace-only text with 400', async () => {
    const res = await request.post('/api/todos').send({ text: '   ' });
    expect(res.status).toBe(400);
  });

  it('rejects text over 500 chars with 400', async () => {
    const res = await request.post('/api/todos').send({ text: 'a'.repeat(501) });
    expect(res.status).toBe(400);
  });

  it('trims whitespace', async () => {
    const res = await request.post('/api/todos').send({ text: '  Buy milk  ' });
    expect(res.status).toBe(201);
    expect(res.body.text).toBe('Buy milk');
  });

  it('sanitizes HTML', async () => {
    const res = await request.post('/api/todos').send({ text: '<script>xss</script>' });
    expect(res.status).toBe(201);
    expect(res.body.text).not.toContain('<script>');
  });
});

describe('PATCH /api/todos/:id', () => {
  it('updates completion status', async () => {
    const created = await request.post('/api/todos').send({ text: 'Test' });
    const res = await request.patch(`/api/todos/${created.body.id}`).send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('toggles back to incomplete', async () => {
    const created = await request.post('/api/todos').send({ text: 'Test' });
    await request.patch(`/api/todos/${created.body.id}`).send({ completed: true });
    const res = await request.patch(`/api/todos/${created.body.id}`).send({ completed: false });
    expect(res.body.completed).toBe(false);
  });

  it('updates text', async () => {
    const created = await request.post('/api/todos').send({ text: 'Old' });
    const res = await request.patch(`/api/todos/${created.body.id}`).send({ text: 'New' });
    expect(res.body.text).toBe('New');
  });

  it('returns 404 for missing todo', async () => {
    const res = await request.patch('/api/todos/nope').send({ completed: true });
    expect(res.status).toBe(404);
  });

  it('rejects invalid completed', async () => {
    const created = await request.post('/api/todos').send({ text: 'Test' });
    const res = await request.patch(`/api/todos/${created.body.id}`).send({ completed: 'yes' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/todos/:id', () => {
  it('deletes a todo', async () => {
    const created = await request.post('/api/todos').send({ text: 'Delete me' });
    const res = await request.delete(`/api/todos/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const list = await request.get('/api/todos');
    expect(list.body).toHaveLength(0);
  });

  it('returns 404 for missing todo', async () => {
    const res = await request.delete('/api/todos/nope');
    expect(res.status).toBe(404);
  });
});

describe('404 handling', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request.get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
