import { test, expect } from '@playwright/test';

test.describe('Todo App E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Page loads and shows app title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('todos');
    await expect(page.locator('.app-subtitle')).toBeVisible();
  });

  test('2. Shows empty state when no todos exist', async ({ page }) => {
    await expect(page.locator('.empty-state')).toBeVisible();
    await expect(page.getByText('No todos yet')).toBeVisible();
  });

  test('3. Create a new todo', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    await expect(page.getByText('Buy groceries')).toBeVisible();
    await expect(input).toHaveValue('');
    await expect(page.locator('.empty-state')).not.toBeVisible();
  });

  test('4. Complete and uncomplete a todo', async ({ page }) => {
    // Create a todo first
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Walk the dog');
    await input.press('Enter');
    await expect(page.getByText('Walk the dog')).toBeVisible();

    // Toggle completion
    const checkbox = page.getByRole('checkbox');
    await checkbox.click();
    await expect(page.locator('.todo-item.completed')).toBeVisible();

    // Verify persists after refresh
    await page.reload();
    await expect(page.locator('.todo-item.completed')).toBeVisible();

    // Toggle back
    const checkboxAfter = page.getByRole('checkbox');
    await checkboxAfter.click();
    await expect(page.locator('.todo-item.completed')).not.toBeVisible();
  });

  test('5. Delete a todo', async ({ page }) => {
    // Create a todo
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Temporary task');
    await input.press('Enter');
    await expect(page.getByText('Temporary task')).toBeVisible();

    // Delete it
    await page.locator('.todo-item').hover();
    await page.locator('.todo-delete-btn').click();

    await expect(page.getByText('Temporary task')).not.toBeVisible();
    await expect(page.locator('.empty-state')).toBeVisible();

    // Verify doesn't return after refresh
    await page.reload();
    await expect(page.getByText('Temporary task')).not.toBeVisible();
  });

  test('6. Prevents adding empty todos', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /add todo/i });
    await expect(addBtn).toBeDisabled();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('   ');
    await expect(addBtn).toBeDisabled();
  });

  test('7. Multiple todos display correctly with counter', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Todo 1');
    await input.press('Enter');
    await input.fill('Todo 2');
    await input.press('Enter');
    await input.fill('Todo 3');
    await input.press('Enter');

    await expect(page.locator('.todo-item')).toHaveCount(3);
    await expect(page.locator('.todo-counter')).toContainText('3 active');

    // Complete one
    const firstCheckbox = page.locator('.todo-item').first().getByRole('checkbox');
    await firstCheckbox.click();
    await expect(page.locator('.todo-counter')).toContainText('2 active');
  });

  test('8. Keyboard navigation works', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Keyboard test');
    await input.press('Enter');

    // Tab through elements
    await page.keyboard.press('Tab'); // to add button
    await page.keyboard.press('Tab'); // to checkbox
    const checkbox = page.locator('.todo-checkbox');
    await expect(checkbox).toBeFocused();
  });

});
