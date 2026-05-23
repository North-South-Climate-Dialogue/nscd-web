import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";

/**
 * Typographic wrapper for MDX content + the component mapping used to style
 * markdown elements. Keep the prose readable on long-form posts.
 */
const components = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mt-12 mb-4 font-display font-extrabold text-ink text-[30px] md:text-[40px] leading-[1.1] tracking-tight normal-case"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mt-10 mb-3 font-display font-extrabold text-ink text-[22px] md:text-[26px] leading-[1.15] tracking-tight normal-case"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="my-5 text-ink text-[17px] md:text-[18px] leading-[1.75]"
      style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-5 pl-6 list-disc marker:text-coral space-y-2 text-ink text-[17px] md:text-[18px] leading-[1.7]" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-5 pl-6 list-decimal marker:text-coral space-y-2 text-ink text-[17px] md:text-[18px] leading-[1.7]" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="pl-1" style={{ overflowWrap: "anywhere", wordBreak: "normal" }} {...props} />
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-8 border-l-4 border-coral pl-5 py-1 text-ink text-[18px] md:text-[20px] leading-[1.6] italic"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-0 border-t-2 border-dashed border-ink/30" />,
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-ink" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-ink/90" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="font-mono bg-ink/8 text-ink text-[0.9em] px-1.5 py-0.5 border border-ink/15 break-words"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="my-6 p-5 border-2 border-ink bg-paper text-[14px] leading-[1.6] overflow-x-auto font-mono"
      {...props}
    />
  ),
  a: ({ href = "#", children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    const className =
      "text-coral border-b-2 border-coral hover:text-ink hover:border-ink transition-colors";
    if (isInternal) {
      return (
        <Link href={href} className={className} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  },
  img: ({ src = "", alt = "", ...rest }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // Use next/image when src is a string path; otherwise fall back to plain <img>.
    typeof src === "string" ? (
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        className="my-8 border-2 border-ink shadow-thunk w-full h-auto"
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img src={src as string} alt={alt} {...rest} />
    )
  ),
};

export default function BlogProse({ source }: { source: string }) {
  return (
    <div
      className="
        max-w-[760px] mx-auto px-6 md:px-8 py-12
        font-sans text-ink
      "
    >
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
        components={components}
      />
    </div>
  );
}
