"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import linesIcon from "@/shared/assets/lines.png";
import { Category, buildCategoryTree } from "@/entities/category";
import { createClient } from "@/shared/api/supabase/client";
import CategoryTree from "./CategoryTree";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("id, name, parent_id")
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data);
      });
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  const tree = buildCategoryTree(categories);

  const closeSidebar = () => setIsOpen(false);

  const handleDeleteCategory = async (id: number, parentId: number | null) => {
    const supabase = createClient();

    // 1. 해당 카테고리의 글을 상위 카테고리로 이동 (없으면 null)
    const { error: postError } = await supabase
      .from("post")
      .update({ category: parentId })
      .eq("category", id);

    if (postError) {
      alert("글 이동에 실패했습니다: " + postError.message);
      return;
    }

    // 2. 하위 카테고리를 상위 카테고리로 이동
    const { error: childError } = await supabase
      .from("categories")
      .update({ parent_id: parentId })
      .eq("parent_id", id);

    if (childError) {
      alert("하위 카테고리 이동에 실패했습니다: " + childError.message);
      return;
    }

    // 3. 카테고리 삭제
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      alert("카테고리 삭제에 실패했습니다: " + deleteError.message);
      return;
    }

    setCategories((prev) =>
      prev
        .filter((c) => c.id !== id)
        .map((c) => (c.parent_id === id ? { ...c, parent_id: parentId } : c))
    );
  };

  const handleRenameCategory = async (id: number, newName: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("categories")
      .update({ name: newName })
      .eq("id", id);

    if (error) {
      alert("카테고리 이름 변경에 실패했습니다: " + error.message);
      return;
    }

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
  };

  return (
    <>
      <button className={styles.menuButton} onClick={() => setIsOpen(true)}>
        <Image src={linesIcon} alt="메뉴" width={20} height={20} />
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={closeSidebar} />
      )}

      <nav className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <Link
          href="/profile"
          className={styles.menuItem}
          onClick={closeSidebar}
        >
          Profile
        </Link>

        <Link
          href="/posts"
          className={styles.menuItem}
          onClick={closeSidebar}
        >
          최근 작성된 글
        </Link>

        {tree.length > 0 && (
          <div className={styles.categorySection}>
            <h3 className={styles.categoryHeading}>카테고리</h3>
            <CategoryTree
              nodes={tree}
              onNavigate={closeSidebar}
              onDelete={handleDeleteCategory}
              onRename={handleRenameCategory}
              isLoggedIn={isLoggedIn}
            />
          </div>
        )}
      </nav>
    </>
  );
}
