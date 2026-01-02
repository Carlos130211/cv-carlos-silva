import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carlos Silva | CV Arcade",
  description: "CV estilo arcade hecho con Next.js + Tailwind",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-mono text-white">{children}</body>
    </html>
  );
}
