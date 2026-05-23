"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/shared/api/supabase/client";
import {
  Category,
  CategoryTreeNode,
  buildCategoryTree,
} from "@/entities/category";
import styles from "./CategorySelector.module.css";

interface CategorySelectorProps {
  value: number | null;
  onChange: (id: number | null) => void;
  initialCategories?: Category[];
}

function flattenTree(
  nodes: CategoryTreeNode[],
  depth = 0
): { category: Category; depth: number }[] {
  const result: { category: Category; depth: number }[] = [];

  const stack = [...nodes].reverse().map((node) => ({ node, depth }));
  while (stack.length > 0) {
    const { node, depth: currentDepth } = stack.pop()!;
    result.push({ category: node, depth: currentDepth });

    for (let i = node.children.length - 1; i >= 0; i -= 1) {
      stack.push({ node: node.children[i], depth: currentDepth + 1 });
    }
  }

  return result;
}

export default function CategorySelector({
  value,
  onChange,
  initialCategories,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>(
    initialCategories ?? []
  );
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newParentId, setNewParentId] = useState<number | null>(null);

  useEffect(() => {
    if (initialCategories !== undefined) return;

    const supabase = createClient();
    supabase
      .from("categories")
      .select("id, name, parent_id")
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, [initialCategories]);

  const flatList = useMemo(
    () => flattenTree(buildCategoryTree(categories)),
    [categories]
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "__create__") {
      setShowCreate(true);
    } else if (val === "") {
      onChange(null);
    } else {
      onChange(Number(val));
    }
  };

  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: trimmed, parent_id: newParentId })
      .select("id, name, parent_id")
      .single();

    if (error) {
      alert("카테고리 생성 실패: " + error.message);
      return;
    }

    if (data) {
      setCategories((prev) => [...prev, data]);
      onChange(data.id);
    }

    setShowCreate(false);
    setNewName("");
    setNewParentId(null);
  };

  return (
    <div className={styles.container}>
      <select
        className={styles.select}
        value={showCreate ? "__create__" : (value ?? "")}
        onChange={handleSelectChange}
      >
        <option value="">카테고리 없음</option>
        {flatList.map(({ category, depth }) => (
          <option
            key={category.id}
            value={category.id}
            className={styles.option}
          >
            {"\u00A0\u00A0".repeat(depth)}
            {depth > 0 ? "└ " : ""}
            {category.name}
          </option>
        ))}
        <option value="__create__">+ 새 카테고리 만들기</option>
      </select>

      {showCreate && (
        <div className={styles.createForm}>
          <input
            className={styles.nameInput}
            type="text"
            placeholder="카테고리 이름"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />
          <select
            className={styles.parentSelect}
            value={newParentId ?? ""}
            onChange={(e) =>
              setNewParentId(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">상위 카테고리 없음</option>
            {flatList.map(({ category, depth }) => (
              <option key={category.id} value={category.id}>
                {"\u00A0\u00A0".repeat(depth)}
                {category.name}
              </option>
            ))}
          </select>
          <button className={styles.createButton} onClick={handleCreate}>
            추가
          </button>
          <button
            className={styles.cancelButton}
            onClick={() => {
              setShowCreate(false);
              setNewName("");
              setNewParentId(null);
            }}
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
}
