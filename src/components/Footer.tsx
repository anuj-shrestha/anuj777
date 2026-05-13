import Link from "next/link";
import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-cream-300/60 mt-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-10 grid sm:grid-cols-2 gap-6 text-sm">
        <div>
          <div className="font-serif text-lg text-ink-900">{profile.name}</div>
          <div className="text-ink-500 mt-1">{profile.location} · {profile.email}</div>
        </div>
        <div className="sm:text-right">
          <div className="flex sm:justify-end gap-4 flex-wrap text-ink-600">
            {profile.socials.map((s) => (
              <Link key={s.label} href={s.href} className="hover:text-terra-600 no-underline">
                {s.label}
              </Link>
            ))}
          </div>
          <div className="text-ink-400 mt-2">© {new Date().getFullYear()}</div>
        </div>
      </div>
    </footer>
  );
}
