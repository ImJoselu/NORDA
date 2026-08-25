import { defineConfig, devices } from '@playwright/test'

/**
 * Suite E2E permanente (seccion 54). Requiere el backend real corriendo en
 * localhost:8080 contra Postgres (./mvnw spring-boot:run, con JAVA_HOME
 * apuntando a un JDK 21) - Playwright solo levanta el frontend por ti.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
