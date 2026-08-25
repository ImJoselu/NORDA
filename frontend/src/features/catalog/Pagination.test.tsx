import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(<Pagination page={0} totalPages={1} onChange={vi.fn()} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('shows the current page as 1-indexed out of the total', () => {
    render(<Pagination page={2} totalPages={5} onChange={vi.fn()} />)

    expect(screen.getByText('Página 3 de 5')).toBeInTheDocument()
  })

  it('disables "Anterior" on the first page', () => {
    render(<Pagination page={0} totalPages={5} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeEnabled()
  })

  it('disables "Siguiente" on the last page', () => {
    render(<Pagination page={4} totalPages={5} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeEnabled()
  })

  it('calls onChange with page + 1 when "Siguiente" is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={1} totalPages={5} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Siguiente' }))

    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('calls onChange with page - 1 when "Anterior" is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={1} totalPages={5} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Anterior' }))

    expect(onChange).toHaveBeenCalledWith(0)
  })
})
