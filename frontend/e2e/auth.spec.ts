import { expect, test } from '@playwright/test'

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`
}

async function registerNewUser(page: import('@playwright/test').Page, email: string) {
  await page.goto('/register')
  await page.getByLabel('Nombre').fill('Ana')
  await page.getByLabel('Apellidos').fill('Diaz')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Contraseña').fill('password123')
  await page.getByRole('button', { name: 'Crear cuenta' }).click()
}

test('a visitor can register, land on their account page, and log out', async ({ page }) => {
  const email = uniqueEmail('e2e-register')

  await registerNewUser(page, email)

  await expect(page).toHaveURL(/\/account$/)
  await expect(page.getByRole('heading', { name: /hola, ana/i })).toBeVisible()

  await page.getByRole('button', { name: 'Cerrar sesión' }).click()
  await expect(page.getByRole('link', { name: /iniciar sesión/i })).toBeVisible()
})

test('registering with an already-used email shows an inline error instead of navigating away', async ({ page }) => {
  const email = uniqueEmail('e2e-duplicate')

  await registerNewUser(page, email)
  await expect(page).toHaveURL(/\/account$/)
  await page.getByRole('button', { name: 'Cerrar sesión' }).click()

  await registerNewUser(page, email)

  await expect(page).toHaveURL(/\/register$/)
  await expect(page.getByRole('alert')).toBeVisible()
})

test('a registered user can log in with the right credentials and is rejected with the wrong one', async ({ page }) => {
  const email = uniqueEmail('e2e-login')

  await registerNewUser(page, email)
  await expect(page).toHaveURL(/\/account$/)
  await page.getByRole('button', { name: 'Cerrar sesión' }).click()

  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Contraseña').fill('wrong-password')
  await page.getByRole('button', { name: /iniciar sesión/i }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page).toHaveURL(/\/login$/)

  await page.getByLabel('Contraseña').fill('password123')
  await page.getByRole('button', { name: /iniciar sesión/i }).click()
  await expect(page).toHaveURL(/\/account$/)
})
