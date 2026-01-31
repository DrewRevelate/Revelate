import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readingTime: string;
  content: string;
  featured?: boolean;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readingTime: string;
  featured?: boolean;
}

function ensureBlogDir(): boolean {
  return fs.existsSync(BLOG_DIR);
}

export function getAllPosts(): BlogPostMeta[] {
  if (!ensureBlogDir()) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      const filePath = path.join(BLOG_DIR, filename);
      const fileContents = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContents);

      // Skip drafts in production
      if (data.draft && process.env.NODE_ENV === 'production') {
        return null;
      }

      const stats = readingTime(content);

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        author: data.author || 'Drew Lambert',
        category: data.category || 'RevOps',
        tags: data.tags || [],
        coverImage: data.coverImage || null,
        readingTime: stats.text,
        featured: data.featured || false,
      } as BlogPostMeta;
    })
    .filter(Boolean) as BlogPostMeta[];

  // Sort by date, newest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!ensureBlogDir()) return null;

  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContents);

  const stats = readingTime(content);

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    author: data.author || 'Drew Lambert',
    category: data.category || 'RevOps',
    tags: data.tags || [],
    coverImage: data.coverImage || null,
    readingTime: stats.text,
    content,
    featured: data.featured || false,
  };
}

export function getPostSlugs(): string[] {
  if (!ensureBlogDir()) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export function getPostsByCategory(category: string): BlogPostMeta[] {
  return getAllPosts().filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  );
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map((p) => p.category));
  return Array.from(categories).sort();
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set(posts.flatMap((p) => p.tags));
  return Array.from(tags).sort();
}
