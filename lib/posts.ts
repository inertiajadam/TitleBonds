import fs from "node:fs";
import path from "node:path";
import { isPhotoKey, type PhotoKey } from "@/lib/photos";

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; columns: string[]; rows: string[][] };

export type Post = {
  slug: string;
  title: string;
  /** ISO date, used for ordering and <time> output. */
  date: string;
  excerpt: string;
  metaDescription: string;
  /** Key into the photo registry; the featured image and the og:image. */
  image: PhotoKey;
  body: PostBlock[];
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function readPosts(): Post[] {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".json"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const post = JSON.parse(raw) as Post;

    const expected = file.replace(/\.json$/, "");
    if (post.slug !== expected) {
      throw new Error(
        `Post content ${file} declares slug "${post.slug}"; expected "${expected}".`,
      );
    }
    if (!isPhotoKey(post.image)) {
      throw new Error(
        `Post content ${file} names image "${post.image}", which is not in the photo registry.`,
      );
    }
    return post;
  });

  // Newest first.
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

let cache: Post[] | undefined;

export function getAllPosts(): Post[] {
  cache ??= readPosts();
  return cache;
}

export function getRecentPosts(count: number): Post[] {
  return getAllPosts().slice(0, count);
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}
