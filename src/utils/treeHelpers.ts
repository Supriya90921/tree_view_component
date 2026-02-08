import { TreeNode } from '../types/tree';

export function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function updateNodeById(
  nodes: TreeNode[],
  id: string,
  updates: Partial<TreeNode>
): TreeNode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodeById(node.children, id, updates),
      };
    }
    return node;
  });
}

export function addNodeById(
  nodes: TreeNode[],
  parentId: string,
  newNode: TreeNode
): TreeNode[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newNode],
        hasLazyChildren: false,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: addNodeById(node.children, parentId, newNode),
      };
    }
    return node;
  });
}

export function removeNodeById(nodes: TreeNode[], id: string): TreeNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.children) {
        return {
          ...node,
          children: removeNodeById(node.children, id),
        };
      }
      return node;
    });
}

export function moveNode(
  nodes: TreeNode[],
  draggedId: string,
  targetId: string,
  position: 'before' | 'after' | 'inside'
): TreeNode[] {
  const draggedNode = findNodeById(nodes, draggedId);
  if (!draggedNode) return nodes;

  // Remove dragged node
  let newTree = removeNodeById(nodes, draggedId);

  if (position === 'inside') {
    // Add as child of target
    newTree = addNodeById(newTree, targetId, draggedNode);
  } else {
    // Add before or after target at same level
    newTree = insertNodeAtPosition(newTree, draggedNode, targetId, position);
  }

  return newTree;
}

function insertNodeAtPosition(
  nodes: TreeNode[],
  nodeToInsert: TreeNode,
  targetId: string,
  position: 'before' | 'after'
): TreeNode[] {
  const result: TreeNode[] = [];

  for (const node of nodes) {
    if (node.id === targetId) {
      if (position === 'before') {
        result.push(nodeToInsert, node);
      } else {
        result.push(node, nodeToInsert);
      }
    } else {
      if (node.children) {
        const updatedNode = {
          ...node,
          children: insertNodeAtPosition(node.children, nodeToInsert, targetId, position),
        };
        result.push(updatedNode);
      } else {
        result.push(node);
      }
    }
  }

  return result;
}

export function generateId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Simulate lazy loading with delay
export async function loadLazyChildren(nodeId: string): Promise<TreeNode[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const count = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    name: `Lazy Child ${i + 1}`,
    hasLazyChildren: Math.random() > 0.5,
  }));
}
