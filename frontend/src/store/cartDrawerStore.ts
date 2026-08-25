import { create } from 'zustand'

interface CartDrawerState {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useCartDrawerStore = create<CartDrawerState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
