import type { ReactNode } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});
import { Providers } from './providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={plusJakartaSans.variable}>
      <body className="">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
