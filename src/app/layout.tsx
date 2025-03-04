import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sleep and Feeding Schedule Controller",
  description: "Optimize your infant's sleep and feeding schedule with smart automated logic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
