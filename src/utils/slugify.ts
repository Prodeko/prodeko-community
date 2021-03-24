/**
 * Next.js SSR flips if we don't prefix all slugs with /
 */
export function slugify(slug: string | string[]) {
  if (Array.isArray(slug)) {
    return `/${slug.join('/')}`;
  }
  return slug.startsWith('/') ? slug : `/${slug}`;
}
