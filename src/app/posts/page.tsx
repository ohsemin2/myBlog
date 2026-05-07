import Link from "next/link";
import { Header } from "@/widgets/header/ui";
import { Footer } from "@/widgets/footer/ui";
import { PostCard } from "@/features/post/list/ui";
import {
  getCategories,
  getPublishedPosts,
  POSTS_PAGE_SIZE,
} from "@/shared/api/supabase/queries";
import type { Category } from "@/entities/category";
import styles from "./page.module.css";

interface PostsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export const revalidate = 30;

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

function parsePositiveInt(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function buildPageHref(page: number, category?: string): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/posts?${query}` : "/posts";
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { category, page } = await searchParams;
  const categoryId = parsePositiveInt(category);
  const currentPage = parsePositiveInt(page) ?? 1;

  let heading = "모든 글";
  let targetIds: number[] | null = null;

  if (categoryId) {
    const categories = await getCategories();
    const categoriesMap = new Map(categories.map((c) => [c.id, c]));

    // 선택된 카테고리 + 모든 하위 카테고리 ID
    targetIds = [categoryId, ...collectDescendantIds(categoryId, categories)];
    heading = buildBreadcrumb(categoryId, categoriesMap);
  }

  const postsWithNext = await getPublishedPosts(
    targetIds,
    currentPage,
    POSTS_PAGE_SIZE
  );
  const hasNextPage = postsWithNext.length > POSTS_PAGE_SIZE;
  const posts = postsWithNext.slice(0, POSTS_PAGE_SIZE);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.heading}>{heading}</h1>
        {posts.length > 0 ? (
          <div className={styles.list}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content ?? ""}
                createdAt={post.published_at ?? post.created_at}
              />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>아직 작성된 글이 없습니다.</p>
        )}
        {(currentPage > 1 || hasNextPage) && (
          <nav className={styles.pagination} aria-label="페이지 이동">
            {currentPage > 1 ? (
              <Link
                href={buildPageHref(currentPage - 1, category)}
                className={styles.pageButton}
              >
                이전
              </Link>
            ) : (
              <span className={styles.pageButtonDisabled}>이전</span>
            )}
            <span className={styles.pageNumber}>{currentPage}</span>
            {hasNextPage ? (
              <Link
                href={buildPageHref(currentPage + 1, category)}
                className={styles.pageButton}
              >
                다음
              </Link>
            ) : (
              <span className={styles.pageButtonDisabled}>다음</span>
            )}
          </nav>
        )}
      </main>
      <Footer />
    </div>
  );
}
