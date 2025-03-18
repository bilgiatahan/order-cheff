import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  tenantId: string | null;
  setToken: (token: string | null) => void;
  setTenantId: (tenantId: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      tenantId: null,
      setToken: (token) => set({ token }),
      setTenantId: (tenantId) => set({ tenantId }),
      clearAuth: () => set({ token: null, tenantId: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
