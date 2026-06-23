import { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { essays } from "@/data/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://anuj-shrestha.github.io";

  // Static routes
  const staticRoutes = ["", "/about", "/projects", "/songs", "/writing"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic project routes
  const projectRoutes = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic essay routes (exclude external ones as they are not hosted on our domain)
  const essayRoutes = essays
    .filter((e) => !e.url)
    .map((e) => ({
      url: `${baseUrl}/writing/${e.slug}`,
      lastModified: new Date(e.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...projectRoutes, ...essayRoutes];
}
