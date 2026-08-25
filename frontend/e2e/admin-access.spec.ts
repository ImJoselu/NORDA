import { expect, test } from '@playwright/test'

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`
}

test('an anonymous visitor is redirected to login when visiting an admin route', async ({ page }) => {
  await page.goto('/admin')

  await expect(page).toHaveURL(/\/login$/)
})

test('a logged-in customer without the ADMIN role is redirected away from admin routes', async ({ page }) => {
  const email = uniqueEmail('e2e-non-admin')

  await page.goto('/register')
  await page.getByLabel('Nombre').fill('Ana')
  await page.getByLabel('Apellidos').fill('Diaz')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Contraseña').fill('password123')
  await page.getByRole('button', { name: 'Crear cuenta' }).click()
  await expect(page).toHaveURL(/\/account$/)

  await page.goto('/admin')

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('link', { name: 'Admin' })).not.toBeVisible()
})
