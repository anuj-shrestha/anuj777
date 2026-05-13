export type Project = {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  year: string;
  status: "ongoing" | "shipped" | "in-progress" | "archived";
  tags: string[];
  link?: { label: string; href: string };
  links?: { label: string; href: string }[]; // use instead of link when there are multiple
  repo?: { label: string; href: string };
  body: string; // long-form, paragraph-broken with \n\n
};

export const projects: Project[] = [
  {
    slug: "programiz",
    title: "Programiz",
    tagline: "Interactive learn-to-code platform used by learners worldwide.",
    role: "Lead Engineer — Parewa Labs",
    year: "2020 — May 2026",
    status: "ongoing",
    tags: ["React", "TypeScript", "Browser editors", "Performance", "UI systems"],
    links: [
      { label: "programiz.com", href: "https://www.programiz.com" },
      { label: "programiz.pro", href: "https://www.programiz.pro" },
    ],
    body: `At Parewa Labs I work on Programiz — an interactive coding platform that runs editors and runtimes for multiple languages in the browser, for a global learner base.

My work has spanned units across the product family — including the Access, PRO, and N3XT lines — where I've owned product surfaces end-to-end: editor behavior, exercise UX, payment flows, and the shared component layer that keeps the experience consistent across them.

The interesting frontend problems here are not glamorous. They are: making code editors feel responsive on a low-end laptop in a low-bandwidth context, making error messages actually teach the learner something, making the difference between a 90ms and a 250ms interaction visible in retention. I care about that work because the user on the other end is usually someone learning to program for the first time, and the UI is most of the teacher.`,
  },
  {
    slug: "visno-editor",
    title: "Visual Story Editor AI",
    tagline: "A visual story editor for building interactive, node-based narratives in the browser.",
    role: "Solo — personal project",
    year: "ongoing",
    status: "ongoing",
    tags: ["React", "TypeScript", "Canvas", "Editor", "Storytelling"],
    link: { label: "visnoeditor.com", href: "https://visnoeditor.com" },
    body: `Visual Story Editor AI is a personal project I'm deeply proud of — a browser-based editor for writing and visualising stories as connected nodes rather than linear documents.

The core idea is that stories branch. Choices, consequences, parallel threads — these are hard to hold in a text file or a linear doc. Visno gives writers a canvas where narrative structure is first-class: nodes are scenes, edges are transitions, and the whole graph is the story.

Building it taught me more about interaction design than any product I've shipped professionally — because I had no brief, no stakeholder, and no one to blame for a bad decision except myself.`,
  },
  {
    slug: "shootemall",
    title: "Shootemall",
    tagline: "A small 2D shoot-em-up game built in Unity, embedded in my old portfolio.",
    role: "Solo — Unity / C#",
    year: "Earlier",
    status: "archived",
    tags: ["Unity", "C#", "Game dev"],
    repo: { label: "github.com/anuj-shrestha/Anuj-Shrestha.github.io", href: "https://github.com/anuj-shrestha/Anuj-Shrestha.github.io" },
    body: `A small 2D game I built while I was still actively doing game development in Unity. Projectile systems, enemy AI, UI animations through TextMeshPro.

I keep this here as a marker. Game dev was my first real software craft — before web, before React, before any of the rest. I expect to come back to it.`,
  },
  {
    slug: "react-web-worker-example",
    title: "react-web-worker-example",
    tagline: "A reference implementation for offloading CPU-bound work to web workers from React, with a typed bridge.",
    role: "Solo — TypeScript demo",
    year: "Earlier",
    status: "shipped",
    tags: ["React", "Web Workers", "Performance"],
    repo: { label: "github.com/anuj-shrestha/react-web-worker-example", href: "https://github.com/anuj-shrestha/react-web-worker-example" },
    body: `A small but real reference for the pattern I reach for whenever a React app needs to do CPU-bound work without blocking the main thread.

The pattern is more useful than the code itself: a typed message bridge between the main thread and the worker, lifecycle tied to a React hook, and a deliberate design choice to make the worker boundary visible at the call site rather than abstracted away.`,
  },
];

export const featuredSlugs = ["programiz", "visno-editor", "shootemall"];
