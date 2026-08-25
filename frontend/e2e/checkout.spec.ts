import { expect, test } from '@playwright/test'

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`
}

test('a customer can complete a full purchase from catalog to confirmation', async ({ page }) => {
  const email = uniqueEmail('e2e-checkout')

  await page.goto('/register')
  await page.getByLabel('Nombre').fill('Ana')
  await page.getByLabel('Apellidos').fill('Diaz')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Contraseña').fill('password123')
  await page.getByRole('button', { name: 'Crear cuenta' }).click()
  await expect(page).toHaveURL(/\/account$/)

  await page.goto('/coffee/colombia-huila-finca-la-esperanza')
  await page.getByRole('button', { name: /añadir al carrito/i }).click()
  await expect(page.getByRole('heading', { name: 'Tu carrito' })).toBeVisible()
  await page.getByRole('button', { name: 'Finalizar compra' }).click()

  await expect(page).toHaveURL(/\/checkout$/)

  // Paso 1: Datos
  await expect(page.getByRole('heading', { name: 'Tus datos' })).toBeVisible()
  await page.getByLabel('Nombre completo').fill('Ana Diaz')
  await page.getByLabel('Teléfono').fill('600123456')
  await page.getByRole('button', { name: 'Siguiente' }).click()

  // Paso 2: Dirección
  await expect(page.getByRole('heading', { name: 'Dirección de envío' })).toBeVisible()
  // getByLabel('Dirección') es ambiguo: coincide tanto con este campo como con el
  // aria-label del ProgressBar ("Paso 2 de 5: Dirección"), asi que apuntamos al
  // textbox explicitamente.
  await page.getByRole('textbox', { name: 'Dirección' }).fill('Calle Mayor 10')
  await page.getByLabel('Ciudad').fill('Madrid')
  await page.getByLabel('Provincia').fill('Madrid')
  await page.getByLabel('Código postal').fill('28013')
  await page.getByRole('button', { name: 'Siguiente' }).click()

  // Paso 3: Envío (STANDARD ya viene seleccionado por defecto)
  await expect(page.getByRole('heading', { name: 'Método de envío' })).toBeVisible()
  await page.getByRole('button', { name: 'Siguiente' }).click()

  // Paso 4: Pago - el boton final NO debe disparar el envio antes de este paso
  // (regresion conocida: ver ADR de checkout / bug de submit prematuro corregido en Fase 7)
  await expect(page.getByRole('button', { name: 'Confirmar y pagar' })).toBeVisible()
  await page.getByRole('button', { name: 'Confirmar y pagar' }).click()

  await expect(page.getByRole('heading', { name: '¡Gracias por tu compra!' })).toBeVisible({ timeout: 10_000 })
  await expect(page.getByText(/NORDA-\d{8}-\d{4}/)).toBeVisible()

  // El pedido debe aparecer en el historial de pedidos de la cuenta
  await page.getByRole('link', { name: 'Ver mis pedidos' }).click()
  await expect(page).toHaveURL(/\/account\/orders$/)
  await expect(page.getByText(/NORDA-\d{8}-\d{4}/).first()).toBeVisible()
})

test('checking out with an empty cart is not possible from the checkout page', async ({ page }) => {
  const email = uniqueEmail('e2e-empty-cart')

  await page.goto('/register')
  await page.getByLabel('Nombre').fill('Ana')
  await page.getByLabel('Apellidos').fill('Diaz')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Contraseña').fill('password123')
  await page.getByRole('button', { name: 'Crear cuenta' }).click()
  await expect(page).toHaveURL(/\/account$/)

  await page.goto('/checkout')

  await expect(page.getByText('Tu carrito está vacío.')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Explorar cafés' })).toBeVisible()
})
