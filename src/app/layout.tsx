import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { SongPlayerProvider } from "@/components/SongPlayerProvider";

export const metadata: Metadata = {
  title: "Anuj Shrestha — engineer, songwriter, maker",
  description:
    "Personal site of Anuj Shrestha. Lead engineer at Parewa Labs (Programiz). Songwriter. Builder of small games and tools. Based in Kathmandu.",
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
