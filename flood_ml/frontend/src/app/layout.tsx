import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "DEIP-192 | Flash Flood Early Warning Dashboard",
  description:
    "AI-powered flash flood prediction, alert generation, and evacuation routing system for Uttarakhand & Assam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#05070B] text-slate-100`}>
        {/* Contagion Grid Deep Obsidian Background */}
        <div className="fixed inset-0 -z-20 bg-[#05070B]" />

        {/* Tactical Grid Overlay Pattern */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ambient Corner & Edge Vignette Glow */}
        <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(circle_at_0%_0%,rgba(14,165,233,0.1)_0%,transparent_35%),radial-gradient(circle_at_100%_0%,rgba(255,59,29,0.08)_0%,transparent_35%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.06)_0%,transparent_45%)]" />

        {children}
      </body>
    </html>
  );
}
