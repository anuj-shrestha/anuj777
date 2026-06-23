import type { Metadata } from "next";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse the selected engineering work, software applications, side projects, and Unity games built by Anuj Shrestha.",
};

export default function ProjectsPage() {
  return (
    <div>
      <header className="mb-10">
        <h1 className="font-serif text-4xl tracking-tight text-ink-900">Projects</h1>
        <p className="text-ink-600 mt-2 max-w-prose">
          Things I&apos;ve shipped, things I&apos;m still shipping, and small tools I built for myself
          that turned into something other people use.
        </p>
      </header>
      <div className="border-t border-cream-300/60">
        {projects.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </div>
    </div>
  );
}
