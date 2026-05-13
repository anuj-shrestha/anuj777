export type Song = {
  title: string;
  language: "Nepali" | "Hindi" | "English" | "Bilingual";
  status: "shipped" | "in-progress";
  theme: string;
  about?: string;
  // Specific video URL. Leave as undefined to fall back to channelUrl.
  url?: string;
};

// YouTube channel home for all songs.
// Per-song video URLs go in each `url` field — fill those in when you have them.
export const channelUrl = "https://www.youtube.com/@ShiaSupertramp";
export const channelName = "ShiaSupertramp";

export const songs: Song[] = [
  // Shipped
  { title: "Maya Ko Kura", language: "Nepali", status: "shipped", theme: "Love, longing", url: "https://www.youtube.com/watch?v=6B3uschBgr8" },
  { title: "Mero Aafnai Cha Sansaara", language: "Nepali", status: "shipped", theme: "Self-reliance", url: "https://www.youtube.com/watch?v=ZebueHrsb64" },
  { title: "Tumhe Kya Chahiye?", language: "Hindi", status: "shipped", theme: "Self-questioning", url:"https://www.youtube.com/watch?v=8L9DHryJFMk" },
  { title: "Agyat Jindagi", language: "Nepali", status: "shipped", theme: "Unknown life", url: "https://www.youtube.com/watch?v=ieBoNhyzNvk" },
  { title: "Chunaab ko Aago", language: "Nepali", status: "shipped", theme: "Social, political", url: "https://www.youtube.com/watch?v=B7PV3PDE7AQ" },
];
