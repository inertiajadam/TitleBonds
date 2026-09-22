import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { getAllStates } from "@/lib/states";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/choose-your-state", priority: 0.9 },
    { path: "/frequently-asked-questions", priority: 0.7 },
    { path: "/blog", priority: 0.6 },
    { path: "/contact", priority: 0.5 },
    { path: "/privacy-policy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
  ].map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified: new Date(),
    priority: route.priority,
  }));

  const stateRoutes = getAllStates().map((state) => ({
    url: `${site.url}/state/${state.slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  const postRoutes = getAllPosts().map((post) => ({
    url: `${site.url}/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.5,
  }));

  return [...staticRoutes, ...stateRoutes, ...postRoutes];
}
