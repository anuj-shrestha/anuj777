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
  { title: "Yatra Nai Jiwan", language: "Nepali", status: "shipped", theme: "Life as a journey", url: "https://www.youtube.com/watch?v=MKbbZKfO-Gk" },
  { title: "Maya Ko Kura", language: "Nepali", status: "shipped", theme: "Love, longing", url: "https://www.youtube.com/watch?v=6B3uschBgr8" },
  { title: "Mero Aafnai Cha Sansaara", language: "Nepali", status: "shipped", theme: "Self-reliance", url: "https://www.youtube.com/watch?v=ZebueHrsb64" },
  { title: "Tumhe Kya Chahiye?", language: "Hindi", status: "shipped", theme: "Self-questioning", url: "https://www.youtube.com/watch?v=8L9DHryJFMk" },
  { title: "Agyat Yo Jindagi", language: "Nepali", status: "shipped", theme: "Unknown life", url: "https://www.youtube.com/watch?v=tamx-MCvx0w" },
  { title: "Chunaab ko Aago", language: "Nepali", status: "shipped", theme: "Social, political", url: "https://www.youtube.com/watch?v=01DeEyiSlfA" },
  { title: "Kindness", language: "English", status: "shipped", theme: "Empathy, connection", url: "https://www.youtube.com/watch?v=JWvmj6zS_vg" },
  { title: "Maya Ko Rog", language: "Nepali", status: "shipped", theme: "Love's affliction", url: "https://www.youtube.com/watch?v=H2jayiho0IQ" },
  { title: "Mutu Poleko Cha", language: "Nepali", status: "shipped", theme: "Heartache", url: "https://www.youtube.com/watch?v=cmfqagBmnJ8" },
  { title: "Maile Sakina", language: "Nepali", status: "shipped", theme: "Regret, helplessness", url: "https://www.youtube.com/watch?v=ckGpx4X0V8Y" },
  { title: "Vitra Ko Aasu", language: "Nepali", status: "shipped", theme: "Inner tears, hidden pain", url: "https://www.youtube.com/watch?v=v45-CNJfQd4" },
];
