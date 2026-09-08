import { create } from 'zustand';

/** A one-shot fly-to-cart animation request. */
export type FlyToCart = {
  id: number;
  /** Viewport coordinates the ghost chip starts from. */
  from: { x: number; y: number };
};

type UIStore = {
  cartDrawerOpen: boolean;
  mobileMenuOpen: boolean;
  searchOverlayOpen: boolean;
  craftVideoOpen: boolean;
  /** Bumped on every add-to-bag so the navbar badge can bounce. */
  bagPulse: number;
  flyToCart: FlyToCart | null;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openSearchOverlay: () => void;
  closeSearchOverlay: () => void;
  openCraftVideo: () => void;
  closeCraftVideo: () => void;
  triggerBagPulse: () => void;
  setFlyToCart: (f: FlyToCart | null) => void;
};

export const useUIStore = create<UIStore>()((set) => ({
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  searchOverlayOpen: false,
  craftVideoOpen: false,
  bagPulse: 0,
  flyToCart: null,

  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  openSearchOverlay: () => set({ searchOverlayOpen: true }),
  closeSearchOverlay: () => set({ searchOverlayOpen: false }),
  openCraftVideo: () => set({ craftVideoOpen: true }),
  closeCraftVideo: () => set({ craftVideoOpen: false }),
  triggerBagPulse: () => set((s) => ({ bagPulse: s.bagPulse + 1 })),
  setFlyToCart: (flyToCart) => set({ flyToCart }),
}));
