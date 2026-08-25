import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StarRatingInput } from './StarRatingInput'

describe('StarRatingInput', () => {
  it('renders max stars, defaulting to 5', () => {
    render(<StarRatingInput value={0} onChange={vi.fn()} />)

    expect(screen.getAllByRole('radio')).toHaveLength(5)
  })

  it('marks only the star matching the current value as checked (radiogroup semantics)', () => {
    render(<StarRatingInput value={3} onChange={vi.fn()} />)

    const stars = screen.getAllByRole('radio')
    expect(stars[2]).toHaveAttribute('aria-checked', 'true') // the "3 estrellas" star
    expect(stars[0]).toHaveAttribute('aria-checked', 'false')
    expect(stars[3]).toHaveAttribute('aria-checked', 'false')
  })

  it('visually fills every star up to and including the current value', () => {
    render(<StarRatingInput value={3} onChange={vi.fn()} />)

    const stars = screen.getAllByRole('radio')
    expect(stars[0]).toHaveTextContent('★')
    expect(stars[2]).toHaveTextContent('★')
    expect(stars[3]).toHaveTextContent('☆')
  })

  it('calls onChange with the clicked star value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StarRatingInput value={0} onChange={onChange} />)

    await user.click(screen.getByRole('radio', { name: '4 estrellas' }))

    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('respects a custom max', () => {
    render(<StarRatingInput value={0} onChange={vi.fn()} max={3} />)

    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })
})
