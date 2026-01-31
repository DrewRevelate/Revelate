import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getPostBySlug, getPostSlugs, getAllPosts } from '@/lib/blog';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  // Article structured data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://www.revelateops.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Revelate Operations',
      url: 'https://www.revelateops.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.revelateops.com/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main className="min-h-screen bg-navy pt-32 pb-20">
        <article className="mx-auto max-w-3xl px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-slate/60">
            <Link
              href="/blog"
              className="hover:text-cyan transition-colors"
            >
              ← Back to Insights
            </Link>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block rounded-full bg-cyan/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan uppercase">
                {post.category}
              </span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-slate text-lg leading-relaxed mb-6">
              {post.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate/70 pb-8 border-b border-white/[0.06]">
              <span className="font-medium text-white/80">{post.author}</span>
              <span className="w-1 h-1 rounded-full bg-slate/40" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="w-1 h-1 rounded-full bg-slate/40" />
              <span>{post.readingTime}</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose-revelate">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/[0.06]">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-xl border border-cyan/20 bg-gradient-to-r from-cyan/[0.05] to-transparent p-8">
            <h3 className="font-heading text-xl text-white mb-2">
              Facing similar challenges?
            </h3>
            <p className="text-slate text-sm mb-4">
              I help Series B SaaS teams modernize legacy Salesforce environments
              without pausing the business. Let&apos;s talk about your situation.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan px-5 py-2.5 text-sm font-semibold text-navy-ink hover:bg-cyan/90 transition-colors"
            >
              Book a Free Discovery Call
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="font-heading text-xl text-white mb-6">
                Related Articles
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group rounded-lg border border-white/[0.06] bg-navy-ink/50 p-5 transition-all duration-200 hover:border-cyan/20"
                  >
                    <h4 className="font-heading text-base text-white mb-2 group-hover:text-cyan transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-slate text-xs line-clamp-2">
                      {related.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </>
  );
}
