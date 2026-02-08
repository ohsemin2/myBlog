"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import xIcon from "@/shared/assets/x.png";
import { CategoryTreeNode } from "@/entities/category";
import styles from "./Sidebar.module.css";

interface CategoryTreeProps {
  nodes: CategoryTreeNode[];
  depth?: number;
  onNavigate: () => void;
  onDelete: (id: number, parentId: number | null) => void;
}

export default function CategoryTree({
  nodes,
  depth = 0,
  onNavigate,
  onDelete,
}: CategoryTreeProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <ul className={styles.treeList} style={{ paddingLeft: depth > 0 ? 16 : 0 }}>
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const isExpanded = expanded.has(node.id);

        return (
          <li key={node.id} className={styles.treeItem}>
            <div className={styles.treeRow}>
              {hasChildren ? (
                <button
                  className={styles.toggleButton}
                  onClick={() => toggle(node.id)}
                  aria-label={isExpanded ? "접기" : "펼치기"}
                >
                  {isExpanded ? "▾" : "▸"}
                </button>
              ) : (
                <span className={styles.togglePlaceholder} />
              )}
              <Link
                href={`/posts?category=${node.id}`}
                className={styles.treeLink}
                onClick={onNavigate}
              >
                {node.name}
              </Link>
              <button
                className={styles.deleteButton}
                onClick={() => {
                  if (confirm(`"${node.name}" 카테고리를 삭제하시겠습니까?`)) {
                    onDelete(node.id, node.parent_id);
                  }
                }}
                aria-label="카테고리 삭제"
              >
                <Image src={xIcon} alt="삭제" width={10} height={10} />
              </button>
            </div>
            {hasChildren && isExpanded && (
              <CategoryTree
                nodes={node.children}
                depth={depth + 1}
                onNavigate={onNavigate}
                onDelete={onDelete}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
