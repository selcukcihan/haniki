import type { Metadata } from "next";
import "./globals.css";

import { Arimo } from 'next/font/google'

const arimo = Arimo({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your habits and build a better you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={arimo.className}>{children}</body>
    </html>
  );
}
