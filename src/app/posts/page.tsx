import { Header } from "@/widgets/header/ui";
import { Footer } from "@/widgets/footer/ui";
import { PostCard } from "@/features/post/list/ui";
import { createClient } from "@/shared/api/supabase/server";
import type { Category } from "@/entities/category";
import styles from "./page.module.css";

interface PostsPageProps {
  searchParams: Promise<{ category?: string }>;
}

function collectDescendantIds(
  categoryId: number,
  categories: Category[]
): number[] {
  const children = categories.filter((c) => c.parent_id === categoryId);
  const ids: number[] = [];
  for (const child of children) {
    ids.push(child.id);
    ids.push(...collectDescendantIds(child.id, categories));
  }
  return ids;
}

function buildBreadcrumb(
  categoryId: number,
  categoriesMap: Map<number, Category>
): string {
  const parts: string[] = [];
  let current = categoriesMap.get(categoryId);
  while (current) {
    parts.unshift(current.name);
    current = current.parent_id !== null
      ? categoriesMap.get(current.parent_id)
      : undefined;
  }
  return parts.join(" > ");
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { category } = await searchParams;
  const categoryId = category ? Number(category) : null;

  const supabase = await createClient();

  let heading = "모든 글";

  if (categoryId) {
    const { data: allCategories } = await supabase
      .from("categories")
      .select("id, name, parent_id");

    const categories = allCategories ?? [];
    const categoriesMap = new Map(categories.map((c) => [c.id, c]));

    // 선택된 카테고리 + 모든 하위 카테고리 ID
    const targetIds = [categoryId, ...collectDescendantIds(categoryId, categories)];

    const { data: posts } = await supabase
      .from("post")
      .select("id, title, content, created_at, published_at")
      .eq("is_draft", false)
      .in("category", targetIds)
      .order("created_at", { ascending: false });

    heading = buildBreadcrumb(categoryId, categoriesMap);

    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <h1 className={styles.heading}>{heading}</h1>
          {posts && posts.length > 0 ? (
            <div className={styles.list}>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  createdAt={post.published_at ?? post.created_at}
                />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>아직 작성된 글이 없습니다.</p>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  const { data: posts } = await supabase
    .from("post")
    .select("id, title, content, created_at, published_at")
    .eq("is_draft", false)
    .order("created_at", { ascending: false });

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.heading}>{heading}</h1>
        {posts && posts.length > 0 ? (
          <div className={styles.list}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                createdAt={post.published_at ?? post.created_at}
              />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>아직 작성된 글이 없습니다.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
