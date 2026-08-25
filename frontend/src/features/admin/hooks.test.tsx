import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useAdminDashboard } from './hooks'
import type { DashboardResponse } from '@/types/admin'

const mockGet = vi.fn()

vi.mock('@/services/httpClient', () => ({
  httpClient: {
    get: (...args: unknown[]) => mockGet(...args),
  },
  ApiError: class ApiError extends Error {},
}))

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

const dashboard: DashboardResponse = {
  totalRevenueCents: 17110,
  totalOrders: 5,
  totalCustomers: 2,
  averageOrderValueCents: 3422,
  lowStockCount: 0,
  activeSubscriptions: 4,
  recurringCustomers: 1,
  salesLast14Days: [],
  topProducts: [],
  topCountries: [],
}

describe('useAdminDashboard', () => {
  it('fetches the dashboard from /admin/dashboard and exposes the parsed data', async () => {
    mockGet.mockResolvedValueOnce(dashboard)

    const { result } = renderHook(() => useAdminDashboard(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGet).toHaveBeenCalledWith('/admin/dashboard')
    expect(result.current.data?.totalOrders).toBe(5)
    expect(result.current.data?.activeSubscriptions).toBe(4)
  })

  it('surfaces a failed request as an error state instead of throwing', async () => {
    mockGet.mockRejectedValueOnce(new Error('network down'))

    const { result } = renderHook(() => useAdminDashboard(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.data).toBeUndefined()
  })
})
