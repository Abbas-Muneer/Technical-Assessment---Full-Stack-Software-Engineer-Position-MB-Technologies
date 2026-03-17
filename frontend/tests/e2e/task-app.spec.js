import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/tasks', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 6,
            title: 'Task 6',
            description: 'Latest visible task',
            status: 'PENDING',
            createdAt: '2026-03-17T10:06:00Z'
          },
          {
            id: 5,
            title: 'Task 5',
            description: 'Second visible task',
            status: 'PENDING',
            createdAt: '2026-03-17T10:05:00Z'
          },
          {
            id: 4,
            title: 'Task 4',
            description: 'Third visible task',
            status: 'PENDING',
            createdAt: '2026-03-17T10:04:00Z'
          },
          {
            id: 3,
            title: 'Task 3',
            description: 'Fourth visible task',
            status: 'PENDING',
            createdAt: '2026-03-17T10:03:00Z'
          },
          {
            id: 2,
            title: 'Task 2',
            description: 'Fifth visible task',
            status: 'PENDING',
            createdAt: '2026-03-17T10:02:00Z'
          }
        ])
      });
      return;
    }

    if (request.method() === 'POST') {
      const payload = request.postDataJSON();
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 7,
          title: payload.title,
          description: payload.description,
          status: 'PENDING',
          createdAt: '2026-03-17T10:07:00Z'
        })
      });
      return;
    }

    await route.fallback();
  });

  await page.route('**/api/tasks/*/complete', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 7,
        title: 'Created from UI',
        description: 'Ready to disappear',
        status: 'COMPLETED',
        createdAt: '2026-03-17T10:07:00Z'
      })
    });
  });
});

test('user can create and complete a task while only five active tasks stay visible', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Task 6')).toBeVisible();
  await expect(page.locator('article')).toHaveCount(5);

  await page.getByLabel('Title').fill('Created from UI');
  await page.getByLabel('Description').fill('Ready to disappear');
  await page.getByRole('button', { name: 'Add task' }).click();

  await expect(page.getByText('Created from UI')).toBeVisible();
  await expect(page.locator('article')).toHaveCount(5);
  await expect(page.getByText('Task 2')).not.toBeVisible();

  await page.getByRole('button', { name: 'Done' }).first().click();

  await expect(page.getByText('Created from UI')).not.toBeVisible();
});
