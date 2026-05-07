import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { Category } from "@/entities/category";
import { createClient } from "./server";
import { createPublicClient } from "./public";

export const POSTS_PAGE_SIZE = 10;
const PUBLIC_POSTS_REVALIDATE_SECONDS = 30;
const PUBLIC_CATEGORIES_REVALIDATE_SECONDS = 300;

export interface PostListItem {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  published_at: string | null;
}

export interface PostDetail {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  published_at: string | null;
  category: number | null;
}

export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("categories")
      .select("id, name, parent_id")
      .order("name");
    return data ?? [];
  },
  ["public-categories"],
  { revalidate: PUBLIC_CATEGORIES_REVALIDATE_SECONDS, tags: ["categories"] }
);

export const getRecentPublishedPosts = unstable_cache(
  async (limit = 5): Promise<PostListItem[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("post")
      .select("id, title, content, created_at, published_at")
      .eq("is_draft", false)
      .order("created_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  },
  ["recent-published-posts"],
  { revalidate: PUBLIC_POSTS_REVALIDATE_SECONDS, tags: ["posts"] }
);

export const getPublishedPosts = unstable_cache(
  async (
    categoryIds: number[] | null,
    page = 1,
    pageSize = POSTS_PAGE_SIZE
  ): Promise<PostListItem[]> => {
    const supabase = createPublicClient();
    const from = Math.max(0, page - 1) * pageSize;
    const to = from + pageSize;

    let query = supabase
      .from("post")
      .select("id, title, content, created_at, published_at")
      .eq("is_draft", false)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (categoryIds && categoryIds.length > 0) {
      query = query.in("category", categoryIds);
    }

    const { data } = await query;
    return data ?? [];
  },
  ["published-posts"],
  { revalidate: PUBLIC_POSTS_REVALIDATE_SECONDS, tags: ["posts"] }
);

export const getPostById = unstable_cache(
  async (id: string): Promise<PostDetail | null> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("post")
      .select("id, title, content, created_at, published_at, category")
      .eq("id", id)
      .single();
    return data;
  },
  ["post-detail"],
  { revalidate: PUBLIC_POSTS_REVALIDATE_SECONDS, tags: ["posts"] }
);
