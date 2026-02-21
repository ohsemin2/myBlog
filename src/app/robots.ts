import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/signup", "/profile", "/post/write", "/drafts"],
    },
    sitemap: "https://www.seminlog.com/sitemap.xml",
  };
}
