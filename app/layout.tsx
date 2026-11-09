import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import GalaxyBackground from "@/components/GalaxyBackground";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scout-landing-kappa.vercel.app"),
  title: "scout — 0→1 product research",
  description:
    "When you have no customers of your own, Scout listens to the market’s. Enterpret’s brain, pointed at the market you’re entering — built for 0→1 when you have no users of your own.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "scout — 0→1 product research",
    description:
      "When you have no customers of your own, Scout listens to the market’s. Enterpret’s brain, pointed at the market you’re entering — built for 0→1 when you have no users of your own.",
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <MotionProvider>
          <GalaxyBackground />
          <div className="relative flex flex-1 flex-col">{children}</div>
        </MotionProvider>
      </body>
    </html>
  );
}
