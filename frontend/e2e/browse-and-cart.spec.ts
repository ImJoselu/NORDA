import { expect, test } from '@playwright/test'

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`
}

test('a visitor can browse the catalog and open a product detail page', async ({ page }) => {
  await page.goto('/coffee')
  await expect(page.getByRole('heading', { name: 'Café de especialidad' })).toBeVisible()

  const firstProductLink = page.locator('a[href^="/coffee/"]').first()
  await expect(firstProductLink).toBeVisible()
  await firstProductLink.click()

  await expect(page).toHaveURL(/\/coffee\/.+/)
  await expect(page.getByRole('button', { name: /añadir al carrito/i })).toBeVisible()
})

test('a logged-in customer can add a coffee to the cart and see it in the drawer', async ({ page }) => {
  const email = uniqueEmail('e2e-cart')
  await page.goto('/register')
  await page.getByLabel('Nombre').fill('Ana')
  await page.getByLabel('Apellidos').fill('Diaz')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Contraseña').fill('password123')
  await page.getByRole('button', { name: 'Crear cuenta' }).click()
  await expect(page).toHaveURL(/\/account$/)

  await page.goto('/coffee/colombia-huila-finca-la-esperanza')
  await expect(page.getByRole('heading', { name: /colombia huila/i })).toBeVisible()

  await page.getByRole('button', { name: /añadir al carrito/i }).click()

  await expect(page.getByRole('heading', { name: 'Tu carrito' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Finalizar compra' })).toBeVisible()
})

test('adding to cart while logged out redirects to login first', async ({ page }) => {
  await page.goto('/coffee/colombia-huila-finca-la-esperanza')
  await page.getByRole('button', { name: /añadir al carrito/i }).click()

  await expect(page).toHaveURL(/\/login$/)
})
