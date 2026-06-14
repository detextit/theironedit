import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Iron Edit",
  description:
    "Chic, practical fitness and nutrition coaching by Ajay Pal Singh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
