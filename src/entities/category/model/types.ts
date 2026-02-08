export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}
