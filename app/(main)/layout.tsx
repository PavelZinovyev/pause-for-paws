import "@/styles/globals.scss";
import { Header } from "@/widgets/header";
import { Suspense } from "react";
import { AppInitializer } from "./app-initializer";
import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<div>error</div>}>
        <AppInitializer />
      </Suspense>
      <Header />
      <main>{children}</main>
    </>
  );
}
