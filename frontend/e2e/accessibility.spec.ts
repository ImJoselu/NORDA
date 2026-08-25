import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const PUBLIC_PAGES = [
  ['/', 'Home'],
  ['/coffee', 'Catálogo'],
  ['/coffee/colombia-huila-finca-la-esperanza', 'Ficha de producto'],
  ['/origins', 'Orígenes'],
  ['/origins/colombia', 'País'],
  ['/origins/colombia/huila', 'Región'],
  ['/finder', 'Coffee Finder'],
  ['/journal', 'Journal'],
  ['/login', 'Login'],
  ['/register', 'Registro'],
] as const

for (const [path, label] of PUBLIC_PAGES) {
  test(`${label} (${path}) has no automatically-detectable accessibility violations`, async ({ page }) => {
    await page.goto(path)
    // No usamos 'networkidle': el HMR websocket del servidor de desarrollo de Vite
    // deja una conexion siempre activa y esa espera nunca se resuelve. Esperamos
    // en su lugar a que el layout principal (header con el logo) este montado.
    await page.getByRole('link', { name: 'NØRDA' }).first().waitFor()
    await page.waitForTimeout(500)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const summary = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.map((n) => n.html).slice(0, 3),
    }))

    expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
  })
}
