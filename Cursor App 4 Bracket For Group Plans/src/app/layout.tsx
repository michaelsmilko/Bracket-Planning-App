import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bracket — Pick your winner",
  description: "Share a link. Friends tap their picks. See what the group wants.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
