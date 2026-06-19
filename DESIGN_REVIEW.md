# Design Review — anuj777 Portfolio

**Reviewed:** 2026-05-13  
**Concern:** "Every Claude output looks like this." The design is competent but reads as AI-default, not as a person.

---

## The core diagnosis

The current stack — cream background, Fraunces serif, Inter body, terra cotta accent, list-based rows, minimal nav — is the single most replicated pattern in AI-generated portfolios right now. Not because it's bad taste, but because it's the platonic safe answer. When someone prompts "make me a nice portfolio," this is what comes out every single time.

The irony: Anuj is a civil-engineer-turned-songwriter who writes in three languages and builds Unity games in Kathmandu. Zero of that personality leaks into the visual language. The site could belong to any frontend engineer on earth.

---

## What specifically makes it read as AI-default

### 1. The hero pattern is a template

`Location eyebrow (uppercase, tracking) → Big name → Italic subtitle → One-paragraph bio → 4-column stat grid`

This exact structure appears on thousands of AI-generated portfolio sites. The stat grid especially — four labeled boxes in a 2×2 grid — is a UI component, not a typographic choice. A real designer would either set those facts inline (prose colophon style) or cut them entirely, since the paragraph already carries the information.

### 2. Fraunces is being used on defaults

Fraunces is a *variable* font with optical sizing (`opsz` 9–144) and a `WONK` axis that makes characters go charmingly weird at high values. The current code loads it with `opsz,wght` in the import but uses it at its default settings. The hero name especially — `font-serif text-4xl sm:text-5xl` — is small enough that the optical size engine never kicks in. Every other site using Fraunces looks identical because everyone does this.

**Fix:** Add to the h1 `.font-hero` class:
```css
font-variation-settings: 'opsz' 144, 'WONK' 1, 'wght' 300;
font-size: clamp(3.5rem, 9vw, 7rem);
```
This alone makes the name look *set*, not dropped in.

### 3. The three section headers are copy-pasted

"Selected work", "Songs", "Writing" all use identical markup: `font-serif text-2xl tracking-tight` left, monospace uppercase right-aligned link. Repeated three times with no variation. This is a template repeating itself. On a real site, the sections people care most about would have different visual weight.

### 4. The only interaction is `hover:text-terra-600`

Every link and card's only hover state is a color change to terra cotta. There are no transitions with character, no movement, no reveals. The songs section has a `SongPlayerProvider` which implies audio playback — but nothing in the UI suggests music before interaction. A song player that looks like a writing entry is a missed opportunity.

### 5. The "777" identity is stranded

The logo says `Anuj · 777`. It's intriguing. It appears nowhere else, is explained nowhere, and has no visual echo anywhere on the site. Either own it (make it a recurring visual mark, give it a tooltip, treat it as a signature) or remove it. A detail that prompts a question but provides no answer reads as random, not intentional.

### 6. Surface has no texture or variation

One cream tone. No noise. No section variation. No depth between foreground and background. The page is a flat plane. Even a single CSS `background-image: url("data:image/svg+xml,...")` noise overlay at 3% opacity on the hero changes the feel from "generated" to "printed."

### 7. The color system doesn't do work

Terra cotta appears: on the location eyebrow, the nav dot separator, the active nav link, and every hover state. It's used everywhere and therefore signals nothing. A more intentional system would use the accent sparingly and *decisively* — one element that is terra per section, not every interactive element.

---

## What actually differentiates a personal site

The sites that read as made by a person (not a prompt) share these properties:

- **One unexpected visual decision** that breaks the formula. A huge name that clips the viewport edge. Type set at an unusual scale. A section that uses a different grid from the rest of the page.
- **Scale contrast** that goes further than "big heading, smaller body." Real contrast means something is so large it feels risky.
- **Interaction that has character.** Brian Lovin's site, Rauno Fring's — the hovers are designed, not defaulted.
- **The font is *tuned*, not applied.** Same font, totally different character when you adjust `opsz`, `wght`, `letter-spacing` with intention.
- **Personal details in the design language**, not just in the copy. Anuj writes in three languages — that could mean something typographically (a Devanagari letterform in the favicon? The hero subtitle set in Nepali?). He was a civil engineer — that could inform a grid that feels structural, not decorative.

---

## Specific recommendations

### Priority 1 — Break the hero (high impact, ~2 hours)

Replace the "eyebrow + name + italic + paragraph + stat grid" pattern:

```
Option A — Go big:
  Name at clamp(3.5rem, 9vw, 7rem) with WONK axis active
  Remove the stat grid entirely
  Let the bio paragraph be the only text below the name
  Location moves to after the name, inline, smaller

Option B — Go dense:
  Compress the hero into a typographic card, think colophon
  All four stat items become inline prose: "Lead engineer at Parewa Labs.
  8 years React. Civil engineer before that. 12+ songs, three languages."
  No labels, no grid, just a paragraph that reads like a business card note
```

Either direction is more intentional than the current middle ground.

### Priority 2 — Make the name look set (30 minutes)

In `globals.css`, add a hero heading class and apply it to the h1 in `page.tsx`:

```css
.hero-name {
  font-variation-settings: 'opsz' 144, 'WONK' 1, 'wght' 300;
  font-size: clamp(3rem, 8vw, 6.5rem);
  line-height: 1;
  letter-spacing: -0.03em;
}
```

The italic subtitle becomes `'opsz' 144, 'wght' 200` — lighter, more optical. This is the single highest-ROI change.

### Priority 3 — Own the "777" or drop it (1 hour)

If keeping it: write a one-line `title` tooltip on the logo. Add a subtle `7` watermark or stamp mark to the hero (a large, very light `777` in the background, `opacity: 0.03`, `font-serif`, `pointer-events-none`). Make it feel like a signature.

If dropping it: the name alone (`Anuj Shrestha`) is cleaner and doesn't raise unanswered questions.

### Priority 4 — Differentiate section treatments (2 hours)

- **Projects** — keep the list but add a left-accent stripe in terra (`border-l-2 border-terra-400/30`) that becomes `border-terra-400` on hover. Gives each item a colored "spine."
- **Songs** — the rows should feel rhythmic. Add the current playing indicator (the `eq-bar` keyframe is already defined in globals.css but apparently unused). Add a subtle `♪` or waveform icon. Make the playing state visually distinct.
- **Writing** — keep the current treatment, it's the best of the three. Maybe reduce the section header to `text-xl` to de-emphasize it relative to projects.

### Priority 5 — One real hover effect (1 hour)

Pick one element and give it a crafted hover. Recommendation: the project title.

```css
.project-title {
  background: linear-gradient(to right, theme('colors.terra.500'), theme('colors.terra.500'));
  background-size: 0% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.3s ease;
}
.project-title:hover {
  background-size: 100% 1px;
}
```

A reveal underline that draws left-to-right on hover. One interaction done with intention communicates more craft than a full animation library.

### Priority 6 — Subtle surface texture (20 minutes)

Add to the `body` or `.hero-section` in globals.css:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.025;
  pointer-events: none;
  z-index: 0;
}
```

This adds subtle paper grain without any visual "effort" — but it makes the cream feel physical rather than digital.

### Priority 7 — Devanagari in the about page subtitle (optional, high personality)

The about page opens with just "About" as a heading. Adding the Nepali self-description as a small caption line (`नमस्ते — म अनुज हुँ`) sets in a smaller font below, adds a signal that says "this person actually lives where they say they live" in a way that no amount of copy can replicate. Load Noto Sans Devanagari via Google Fonts for this one line only.

---

## What not to change

- The cream/ink/terra color palette is good. The problem is *how* it's used, not the palette itself.
- The font choices (Fraunces + Inter + JetBrains Mono) are correct. Just use the variable axes.
- The list-based project/writing entries are better than cards — they feel editorial. Keep the pattern, just differentiate each section slightly.
- The prose on the About page is genuinely good. The writing voice is distinct. Don't touch it.
- The `::selection` override (`bg-terra-500 text-cream-50`) is a lovely detail. Keep it.
- The sticky blur nav is correct behavior.

---

## TL;DR

The design is well-executed but deliberately safe. The changes that will make it feel personal are not stylistic additions — they're about using the existing tools (Fraunces variable axes, the 777 mark, the Nepal/songs identity, the existing animation keyframe that's already written but unused) with actual intention. The difference between a portfolio that looks AI-generated and one that doesn't is usually 3–4 decisions made with specificity, not a redesign.
