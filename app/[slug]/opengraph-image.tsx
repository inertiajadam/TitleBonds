import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { getAllPosts, getPost } from "@/lib/posts";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Title bond guide";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  return renderOgImage({
    eyebrow: "Title bond guide",
    title: post?.title ?? "Title bonds",
    photo: post?.image,
  });
}
