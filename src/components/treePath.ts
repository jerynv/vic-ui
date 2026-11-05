import type { ReactNode } from "react";

/* What a tree is and where a row sits in it, with nothing that draws, so a test reads it without a page. */

/** One branch or leaf of a tree: its id, its words, the mark before them and what is under it. */
export interface TreeItem {
  id: string;
  label: ReactNode;
  /** What type-ahead matches when `label` is not a string. */
  text?: string;
  icon?: ReactNode;
  /** A quiet word after the label, as a place's kind. */
  end?: ReactNode;
  children?: TreeItem[];
}

/** The ids from the top down to `id`, not counting it: the branches that hold it. */
export function treePathTo(items: readonly TreeItem[], id: string | null): string[] {
  if (!id) return [];
  const walk = (list: readonly TreeItem[], above: string[]): string[] | null => {
    for (const item of list) {
      if (item.id === id) return above;
      const found = item.children ? walk(item.children, [...above, item.id]) : null;
      if (found) return found;
    }
    return null;
  };
  return walk(items, []) ?? [];
}
