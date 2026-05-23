import { notFound } from "next/navigation";
import BlogPostHeader from "@/components/blog/BlogPostHeader";
import BlogProse from "@/components/blog/BlogProse";
import BlogPostFooter from "@/components/blog/BlogPostFooter";
import {
  getAllPostsMeta,
  getPostBySlug,
  getAdjacentPosts,
} from "@/lib/blog/posts";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPostsMeta().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} · NSCD Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(post.slug);

  return (
    <article>
      <BlogPostHeader post={post} />
      <BlogProse source={post.body} />
      <BlogPostFooter prev={prev} next={next} />
    </article>
  );
}
