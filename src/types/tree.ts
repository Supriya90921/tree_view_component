export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  hasLazyChildren?: boolean;
  isLoading?: boolean;
}

export interface TreeViewProps {
  data: TreeNode[];
  onUpdate: (data: TreeNode[]) => void;
}
