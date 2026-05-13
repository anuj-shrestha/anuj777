import Link from "next/link";
import { profile } from "@/data/profile";

export default function AboutPage() {
  return (
    <div>
      <header className="mb-10">
        <div className="text-sm uppercase tracking-[0.2em] text-terra-500 mb-3">{profile.location}</div>
        <h1 className="font-serif text-4xl tracking-tight text-ink-900">About</h1>
      </header>

      <div className="prose-warm">
        <p>{profile.pitch}</p>
        <p>{profile.longer}</p>

        <h2>How I got here</h2>
        <p>
          I trained as a civil engineer. I made the switch to software a few years into that, partly because the
          feedback loops in code were tighter than the feedback loops in buildings — and partly because I&apos;d
          already been building small games and tools on the side and it was clear which one I cared about.
        </p>
        <p>
          The civil-engineering instinct didn&apos;t leave. I still think about software the way I was taught to think
          about a structure: where do the loads go, where are the failure modes, what happens if this single
          assumption is wrong.
        </p>

        <h2>What I&apos;m working on</h2>
        <p>
          My main job is leading frontend work at Parewa Labs on Programiz — a learn-to-code platform used by
          learners around the world. Outside that, I write songs (12 so far, on{" "}
          <Link href="https://www.youtube.com/@ShiaSupertramp" target="_blank" rel="noopener noreferrer">
            YouTube
          </Link>
          ), and build small games in Unity.
        </p>
        <p>
          On the side I&apos;m building Nova, a personal AI that runs my Notion + Slack life, and a course-generation
          platform.
        </p>

        <h2>How I work</h2>
        <p>
          Direct, practical, no fluff. I&apos;d rather hear &ldquo;here&apos;s the trade-off, here&apos;s the
          recommendation&rdquo; than &ldquo;let me first explain what a heap is.&rdquo; I think the best engineers
          are the ones who can hold both the human and the machine side of a system in their head at once — and the
          best teammates are the ones who tell you when you&apos;re wrong before the code does.
        </p>

        <h2>Get in touch</h2>
        <p>
          The fastest paths are{" "}
          <Link href={`mailto:${profile.email}`}>{profile.email}</Link> and{" "}
          <Link href="https://github.com/anuj-shrestha" target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
          . I read everything.
        </p>
      </div>
    </div>
  );
}
