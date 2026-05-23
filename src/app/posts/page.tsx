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
  childrenByParent: Map<number, Category[]>
): number[] {
  const ids: number[] = [];

  const stack = [...(childrenByParent.get(categoryId) ?? [])];
  while (stack.length > 0) {
    const child = stack.pop()!;
    ids.push(child.id);
    stack.push(...(childrenByParent.get(child.id) ?? []));
  }

  return ids;
}

function buildChildrenMap(categories: Category[]) {
  const childrenByParent = new Map<number, Category[]>();

  for (const category of categories) {
    if (category.parent_id === null) continue;

    const children = childrenByParent.get(category.parent_id);
    if (children) {
      children.push(category);
    } else {
      childrenByParent.set(category.parent_id, [category]);
    }
  }

  return childrenByParent;
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
    const childrenByParent = buildChildrenMap(categories);

    targetIds = [categoryId, ...collectDescendantIds(categoryId, childrenByParent)];
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
