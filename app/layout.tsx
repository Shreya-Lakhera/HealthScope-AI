import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediLocker | Friendly health screening estimates",
  description: "Private, educational health screening estimates powered by trained models.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
