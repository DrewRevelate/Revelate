import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getAllCategories, type BlogPostMeta } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog — RevOps Insights & Best Practices',
  description:
    'Practical RevOps insights for Series B SaaS teams. Salesforce modernization, pipeline operations, and revenue stack architecture from the field.',
  openGraph: {
    title: 'Blog — Revelate Operations',
    description:
      'Practical RevOps insights for Series B SaaS teams.',
    type: 'website',
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block rounded-full bg-cyan/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan uppercase">
      {category}
    </span>
  );
}

function FeaturedPost({ post }: { post: BlogPostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-navy-ink/80 to-navy/90 p-8 md:p-12 transition-all duration-300 hover:border-cyan/20 hover:shadow-lg hover:shadow-cyan/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block rounded-full bg-magenta/20 px-3 py-1 text-xs font-semibold tracking-wide text-magenta uppercase">
              Featured
            </span>
            <CategoryBadge category={post.category} />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl text-white mb-4 group-hover:text-cyan transition-colors duration-200">
            {post.title}
          </h2>
          <p className="text-slate text-lg leading-relaxed mb-6 max-w-2xl">
            {post.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-slate/70">
            <span>{post.author}</span>
            <span className="w-1 h-1 rounded-full bg-slate/40" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="w-1 h-1 rounded-full bg-slate/40" />
            <span>{post.readingTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="h-full rounded-xl border border-white/[0.06] bg-navy-ink/50 p-6 transition-all duration-300 hover:border-cyan/20 hover:bg-navy-ink/70 hover:shadow-md hover:shadow-cyan/5">
        <div className="mb-3">
          <CategoryBadge category={post.category} />
        </div>
        <h3 className="font-heading text-xl text-white mb-3 group-hover:text-cyan transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-slate text-sm leading-relaxed mb-4 line-clamp-3">
          {post.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-slate/60">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="w-1 h-1 rounded-full bg-slate/40" />
          <span>{post.readingTime}</span>
        </div>
      </article>
    </Link>
  );
}

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const featured = posts.find((p) => p.featured);
  const remaining = posts.filter((p) => p !== featured);

  if (posts.length === 0) {
    return (
      <main className="min-h-screen bg-navy pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-heading text-4xl text-white mb-4">Blog</h1>
          <p className="text-slate text-lg">Posts coming soon. Check back shortly.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
            Insights
          </h1>
          <p className="text-slate text-lg max-w-2xl">
            Practical RevOps thinking from the field. Salesforce modernization,
            pipeline architecture, and the operational patterns that separate
            scaling companies from stalling ones.
          </p>
        </div>

        {/* Category pills */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-slate hover:border-cyan/30 hover:text-cyan transition-colors cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Featured post */}
        {featured && (
          <div className="mb-12">
            <FeaturedPost post={featured} />
          </div>
        )}

        {/* Post grid */}
        {remaining.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {remaining.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
