import { create } from 'zustand';

type UIStore = {
  cartDrawerOpen: boolean;
  mobileMenuOpen: boolean;
  searchOverlayOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  openSearchOverlay: () => void;
  closeSearchOverlay: () => void;
  toggleSearchOverlay: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  searchOverlayOpen: false,

  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  toggleCartDrawer: () => set((s) => ({ cartDrawerOpen: !s.cartDrawerOpen })),

  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),

  openSearchOverlay: () => set({ searchOverlayOpen: true }),
  closeSearchOverlay: () => set({ searchOverlayOpen: false }),
  toggleSearchOverlay: () => set((s) => ({ searchOverlayOpen: !s.searchOverlayOpen })),
}));
