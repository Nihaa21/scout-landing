import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://scout-landing-nihaghali554-1940-nihaghali554-1940s-projects.vercel.app",
  ),
  title: "scout — 0→1 product research",
  description:
    "Research what the market thinks — before you build it. Scout reads public feedback, finds the themes, and hands you the brief.",
  openGraph: {
    title: "scout — 0→1 product research",
    description:
      "Research what the market thinks — before you build it. Scout reads public feedback, finds the themes, and hands you the brief.",
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
      className={`${spaceGrotesk.variable} ${plexMono.variable} ${newsreader.variable} h-full antialiased bg-background`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
