import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { SongPlayerProvider } from "@/components/SongPlayerProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://anuj-shrestha.github.io"),
  title: {
    default: "Anuj Shrestha — engineer, songwriter, maker",
    template: "%s | Anuj Shrestha",
  },
  description:
    "Personal site of Anuj Shrestha. Lead engineer at Parewa Labs (Programiz). Songwriter. Builder of small games and tools. Based in Kathmandu.",
  keywords: [
    "Anuj Shrestha",
    "Software Engineer",
    "Songwriter",
    "Kathmandu",
    "Nepal",
    "React",
    "TypeScript",
    "Next.js",
    "Unity",
    "Game Developer",
    "Parewa Labs",
    "Programiz",
  ],
  authors: [{ name: "Anuj Shrestha" }],
  creator: "Anuj Shrestha",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anuj-shrestha.github.io",
    title: "Anuj Shrestha — engineer, songwriter, maker",
    description:
      "Personal site of Anuj Shrestha. Lead engineer at Parewa Labs (Programiz). Songwriter. Builder of small games and tools. Based in Kathmandu.",
    siteName: "Anuj Shrestha",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anuj Shrestha — engineer, songwriter, maker",
    description:
      "Personal site of Anuj Shrestha. Lead engineer at Parewa Labs (Programiz). Songwriter. Builder of small games and tools. Based in Kathmandu.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SongPlayerProvider>
          <NavBar />
          <main className="max-w-3xl mx-auto px-5 sm:px-6 py-12">{children}</main>
          <Footer />
        </SongPlayerProvider>
      </body>
    </html>
  );
}
