import '@/styles/globals.scss';
import { Header } from '@/widgets/header';
import { Suspense } from 'react';
import { AppInitializer } from './app-initializer';
import type { ReactNode } from 'react';
import s from './layout.module.scss';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className={s.root}>
      <Suspense fallback={<div>error</div>}>
        <AppInitializer />
      </Suspense>
      <Header />
      <main>{children}</main>
    </div>
  );
}
