"use client";
import "./globals.css";
import Menu from "@/components/menu";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hiddenPaths = ["/login", "/register", "/adlogin", "/adregister"];

  return (
    <html lang="en">
      <body>
        {!hiddenPaths.some((path) => pathname.startsWith(path)) && <Menu />}
        <Toaster />
        {children}
      </body>
    </html>
  );
}
