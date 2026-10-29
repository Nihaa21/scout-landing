import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GalaxyBackground from "@/components/GalaxyBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scout-landing-kappa.vercel.app"),
  title: "scout — 0→1 product research",
  description:
    "Research what the market thinks — before you build it. Enterpret’s brain, pointed at the market you’re entering.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "scout — 0→1 product research",
    description:
      "Research what the market thinks — before you build it. Enterpret’s brain, pointed at the market you’re entering.",
    url: "/",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <GalaxyBackground />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
