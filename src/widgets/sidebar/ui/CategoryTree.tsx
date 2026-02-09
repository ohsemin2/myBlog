"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import xIcon from "@/shared/assets/x.png";
import pencilIcon from "@/shared/assets/pencil.png";
import { CategoryTreeNode } from "@/entities/category";
import styles from "./Sidebar.module.css";

interface CategoryTreeProps {
  nodes: CategoryTreeNode[];
  depth?: number;
  onNavigate: () => void;
  onDelete: (id: number, parentId: number | null) => void;
  onRename: (id: number, newName: string) => void;
  isLoggedIn: boolean;
}

export default function CategoryTree({
  nodes,
  depth = 0,
  onNavigate,
  onDelete,
  onRename,
  isLoggedIn,
}: CategoryTreeProps) {
  const collectIds = (ns: CategoryTreeNode[]): number[] =>
    ns.flatMap((n) => [n.id, ...collectIds(n.children)]);
  const [expanded, setExpanded] = useState<Set<number>>(
    () => new Set(collectIds(nodes))
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

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

  const startEditing = (node: CategoryTreeNode) => {
    setEditingId(node.id);
    setEditName(node.name);
  };

  const submitRename = (id: number) => {
    const trimmed = editName.trim();
    if (trimmed) {
      onRename(id, trimmed);
    }
    setEditingId(null);
    setEditName("");
  };

  return (
    <ul className={styles.treeList} style={{ paddingLeft: depth > 0 ? 16 : 0 }}>
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const isExpanded = expanded.has(node.id);
        const isEditing = editingId === node.id;

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
              {isEditing ? (
                <input
                  className={styles.renameInput}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitRename(node.id);
                    if (e.key === "Escape") {
                      setEditingId(null);
                      setEditName("");
                    }
                  }}
                  onBlur={() => submitRename(node.id)}
                  autoFocus
                />
              ) : (
                <Link
                  href={`/posts?category=${node.id}`}
                  className={styles.treeLink}
                  onClick={onNavigate}
                >
                  {node.name}
                </Link>
              )}
              {isLoggedIn && !isEditing && (
                <>
                  <button
                    className={styles.editButton}
                    onClick={() => startEditing(node)}
                    aria-label="카테고리 이름 수정"
                  >
                    <Image src={pencilIcon} alt="수정" width={10} height={10} />
                  </button>
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
                </>
              )}
            </div>
            {hasChildren && isExpanded && (
              <CategoryTree
                nodes={node.children}
                depth={depth + 1}
                onNavigate={onNavigate}
                onDelete={onDelete}
                onRename={onRename}
                isLoggedIn={isLoggedIn}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
