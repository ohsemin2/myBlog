import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://www.seminlog.com";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  );

  const { data: posts } = await supabase
    .from("post")
    .select("id, created_at, published_at")
    .eq("is_draft", false)
    .order("created_at", { ascending: false });

  const staticPages = [
    { url: BASE_URL, lastmod: new Date().toISOString(), changefreq: "weekly", priority: "1" },
    { url: `${BASE_URL}/posts`, lastmod: new Date().toISOString(), changefreq: "weekly", priority: "0.8" },
  ];

  const postPages = (posts ?? []).map((post) => ({
    url: `${BASE_URL}/post/${post.id}`,
    lastmod: new Date(post.published_at ?? post.created_at).toISOString(),
    changefreq: "monthly",
    priority: "0.7",
  }));

  const allPages = [...staticPages, ...postPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allPages.map((page) => `  <url>\n    <loc>${page.url}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`).join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
