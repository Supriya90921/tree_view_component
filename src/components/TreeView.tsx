import { TreeViewProps } from '../types/tree';
import { TreeNode } from './TreeNode';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import {
  updateNodeById,
  addNodeById,
  removeNodeById,
  moveNode,
  generateId,
  loadLazyChildren,
} from '../utils/treeHelpers';

export function TreeView({ data, onUpdate }: TreeViewProps) {
  const { dragState, handleDragStart, handleDragOver, handleDragEnd } = useDragAndDrop();

  const handleToggle = (id: string) => {
    const updated = updateNodeById(data, id, {
      isExpanded: !data.find((n) => n.id === id)?.isExpanded,
    });
    onUpdate(updated);
  };

  const handleAdd = (parentId: string, name: string) => {
    const newNode = {
      id: generateId(),
      name,
    };
    const updated = addNodeById(data, parentId, newNode);
    onUpdate(updated);
  };

  const handleRemove = (id: string) => {
    const updated = removeNodeById(data, id);
    onUpdate(updated);
  };

  const handleEdit = (id: string, name: string) => {
    const updated = updateNodeById(data, id, { name });
    onUpdate(updated);
  };

  const handleLoadLazy = async (id: string) => {
    // Set loading state
    let updated = updateNodeById(data, id, { isLoading: true });
    onUpdate(updated);

    // Load children
    const children = await loadLazyChildren(id);

    // Update with children
    updated = updateNodeById(data, id, {
      isLoading: false,
      children,
      hasLazyChildren: false,
      isExpanded: true,
    });
    onUpdate(updated);
  };

  const handleDrop = (
    draggedId: string,
    targetId: string,
    position: 'before' | 'after' | 'inside'
  ) => {
    if (draggedId === targetId) return;
    const updated = moveNode(data, draggedId, targetId, position);
    onUpdate(updated);
  };

  return (
    <div className="tree-view">
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          onToggle={handleToggle}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onEdit={handleEdit}
          onLoadLazy={handleLoadLazy}
          dragState={dragState}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
