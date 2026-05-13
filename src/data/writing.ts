export type Essay = {
  slug: string;
  title: string;
  summary: string;
  date: string; // YYYY-MM-DD
  status: "published" | "draft";
  body?: string; // paragraph-broken with \n\n; omit for external posts
  url?: string;  // external link; if set, links out instead of to /writing/[slug]
};

export const essays: Essay[] = [
  // Blog stories (external)
  {
    slug: "city-dungeon",
    title: "City Dungeon",
    summary:
      "A fantasy serial about Spike, a young demon lord who secretly builds a city inside his dungeon and tries to keep his monster citizens hidden from the human world. 46+ chapters.",
    date: "2020-12-01",
    status: "published",
    url: "https://batmanshrestha.blogspot.com/2021/01/city-dungeon-ch-46-dawn-of-new-age.html",
  },
  {
    slug: "kidnapping-school",
    title: "Kidnapping School",
    summary:
      "A Nepali comedy about a kidnapping that doesn't quite go to plan. Absurdist, dialogue-heavy, chaotic fun.",
    date: "2022-03-01",
    status: "published",
    url: "https://batmanshrestha.blogspot.com/2022/03/kidnapping-school.html",
  },
];
