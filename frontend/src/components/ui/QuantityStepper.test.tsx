import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QuantityStepper } from './QuantityStepper'

describe('QuantityStepper', () => {
  it('calls onChange with quantity + 1 when the increase button is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<QuantityStepper quantity={2} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Aumentar cantidad' }))

    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('calls onChange with quantity - 1 when the decrease button is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<QuantityStepper quantity={2} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Reducir cantidad' }))

    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('disables the decrease button at the minimum', () => {
    render(<QuantityStepper quantity={1} onChange={vi.fn()} min={1} />)

    expect(screen.getByRole('button', { name: 'Reducir cantidad' })).toBeDisabled()
  })

  it('disables the increase button at the maximum', () => {
    render(<QuantityStepper quantity={20} onChange={vi.fn()} max={20} />)

    expect(screen.getByRole('button', { name: 'Aumentar cantidad' })).toBeDisabled()
  })

  it('disables both buttons when disabled is set, regardless of bounds', () => {
    render(<QuantityStepper quantity={5} onChange={vi.fn()} disabled />)

    expect(screen.getByRole('button', { name: 'Reducir cantidad' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Aumentar cantidad' })).toBeDisabled()
  })

  it('renders the current quantity', () => {
    render(<QuantityStepper quantity={7} onChange={vi.fn()} />)

    expect(screen.getByText('7')).toBeInTheDocument()
  })
})
