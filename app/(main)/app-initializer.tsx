"use client";

import { useCookieConsent } from "@/features/cookie-consent/hooks/use-cookie-consent";

export function AppInitializer() {
  useCookieConsent();
  // useAuth

  return null;
}
