import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import Providers from "./providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={plusJakartaSans.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
