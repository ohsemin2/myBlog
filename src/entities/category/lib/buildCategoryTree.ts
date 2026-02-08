import { Category, CategoryTreeNode } from "../model/types";

export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const map = new Map<number, CategoryTreeNode>();

  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }

  const roots: CategoryTreeNode[] = [];

  for (const node of map.values()) {
    if (node.parent_id === null) {
      roots.push(node);
    } else {
      const parent = map.get(node.parent_id);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
  }

  return roots;
}
