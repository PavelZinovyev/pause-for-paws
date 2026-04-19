import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CookieConsentState = {
  isConsentGiven: boolean;
  hasHydrated: boolean;
  acceptCookies: () => void;
  resetCookiesConsent: () => void;
  setHasHydrated: (value: boolean) => void;
};

const COOKIE_CONSENT_STORAGE_KEY = "cookie_consent";

export const useCookieConsentStore = create<CookieConsentState>()(
  persist(
    (set) => ({
      isConsentGiven: false,
      hasHydrated: false,

      acceptCookies: () => {
        set({ isConsentGiven: true });
      },

      resetCookiesConsent: () => {
        set({ isConsentGiven: false });
      },

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: COOKIE_CONSENT_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isConsentGiven: state.isConsentGiven,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
