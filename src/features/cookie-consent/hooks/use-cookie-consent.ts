"use client";

import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { useCookieConsentStore } from "../store/cookie-consent.store";

export function useCookieConsent() {
  const isConsentGiven = useCookieConsentStore((state) => state.isConsentGiven);
  const hasHydrated = useCookieConsentStore((state) => state.hasHydrated);
  const acceptCookiesInStore = useCookieConsentStore(
    (state) => state.acceptCookies,
  );

  const acceptCookies = useCallback(() => {
    acceptCookiesInStore();
    toast.success("Спасибо! Вы приняли использование cookies.");
  }, [acceptCookiesInStore]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (isConsentGiven) return;

    toast("Мы используем cookies для улучшения работы сайта.", {
      action: {
        label: "Принять",
        onClick: acceptCookies,
      },
    });
  }, [acceptCookies, hasHydrated, isConsentGiven]);

  return {
    isConsentGiven,
    isHydrated: hasHydrated,
    acceptCookies,
  };
}
