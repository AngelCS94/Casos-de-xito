import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generador de casos de éxito",
  description: "MVP para generar una slide corporativa de caso de éxito en formato PPTX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
