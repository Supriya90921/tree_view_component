import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  GripVertical,
} from 'lucide-react';
import { TreeNode as TreeNodeType } from '../types/tree';
import { DragState } from '../hooks/useDragAndDrop';

interface TreeNodeProps {
  node: TreeNodeType;
  level: number;
  onToggle: (id: string) => void;
  onAdd: (parentId: string, name: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, name: string) => void;
  onLoadLazy: (id: string) => void;
  dragState: DragState;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string, position: 'before' | 'after' | 'inside') => void;
  onDragEnd: () => void;
  onDrop: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
}

export function TreeNode({
  node,
  level,
  onToggle,
  onAdd,
  onRemove,
  onEdit,
  onLoadLazy,
  dragState,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}: TreeNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasChildren = node.children && node.children.length > 0;
  const canExpand = hasChildren || node.hasLazyChildren;

  const handleToggle = () => {
    if (node.hasLazyChildren && !hasChildren && !node.isLoading) {
      onLoadLazy(node.id);
    }
    onToggle(node.id);
  };

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue !== node.name) {
      onEdit(node.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleAddChild = () => {
    if (newChildName.trim()) {
      onAdd(node.id, newChildName.trim());
      setNewChildName('');
      setIsAddingChild(false);
      if (!node.isExpanded) {
        onToggle(node.id);
      }
    }
  };

  const handleDelete = () => {
    onRemove(node.id);
    setShowDeleteConfirm(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragState.draggedId && dragState.dropPosition) {
      onDrop(dragState.draggedId, node.id, dragState.dropPosition);
    }
    onDragEnd();
  };

  const isDragging = dragState.draggedId === node.id;
  const isDropTarget = dragState.dragOverId === node.id;

  return (
    <div className="tree-node-container">
      {/* Drop indicator before */}
      {isDropTarget && dragState.dropPosition === 'before' && (
        <div className="drop-indicator drop-before" />
      )}

      <div
        className={`tree-node ${isDragging ? 'dragging' : ''} ${isDropTarget && dragState.dropPosition === 'inside' ? 'drop-inside' : ''}`}
        style={{ paddingLeft: `${level * 24}px` }}
        draggable
        onDragStart={(e) => {
          e.stopPropagation();
          onDragStart(node.id);
        }}
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const height = rect.height;

          if (y < height * 0.25) {
            onDragOver(e, node.id, 'before');
          } else if (y > height * 0.75) {
            onDragOver(e, node.id, 'after');
          } else {
            onDragOver(e, node.id, 'inside');
          }
        }}
        onDrop={handleDrop}
      >
        <div className="tree-node-content">
          <GripVertical className="drag-handle" />

          {canExpand ? (
            <button
              className="expand-button"
              onClick={handleToggle}
              disabled={node.isLoading}
            >
              {node.isLoading ? (
                <Loader2 className="loading-icon" />
              ) : node.isExpanded ? (
                <ChevronDown className="icon" />
              ) : (
                <ChevronRight className="icon" />
              )}
            </button>
          ) : (
            <span className="expand-placeholder" />
          )}

          {isEditing ? (
            <input
              className="edit-input"
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditSubmit();
                if (e.key === 'Escape') {
                  setEditValue(node.name);
                  setIsEditing(false);
                }
              }}
              autoFocus
            />
          ) : (
            <span
              className="node-name"
              onDoubleClick={() => setIsEditing(true)}
            >
              {node.name}
            </span>
          )}

          <div className="node-actions">
            <button
              className="action-button"
              onClick={() => setIsEditing(true)}
              title="Edit name"
            >
              <Edit2 className="icon-sm" />
            </button>
            <button
              className="action-button"
              onClick={() => setIsAddingChild(true)}
              title="Add child"
            >
              <Plus className="icon-sm" />
            </button>
            <button
              className="action-button delete"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete node"
            >
              <Trash2 className="icon-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Drop indicator after */}
      {isDropTarget && dragState.dropPosition === 'after' && (
        <div className="drop-indicator drop-after" />
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div
          className="confirm-dialog"
          style={{ paddingLeft: `${(level + 1) * 24}px` }}
        >
          <span>Delete this node and all its children?</span>
          <div className="confirm-actions">
            <button className="confirm-button danger" onClick={handleDelete}>
              Delete
            </button>
            <button
              className="confirm-button"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add child input */}
      {isAddingChild && (
        <div
          className="add-child-input"
          style={{ paddingLeft: `${(level + 1) * 24}px` }}
        >
          <input
            type="text"
            placeholder="Enter node name"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddChild();
              if (e.key === 'Escape') {
                setNewChildName('');
                setIsAddingChild(false);
              }
            }}
            autoFocus
          />
          <div className="add-child-actions">
            <button className="confirm-button" onClick={handleAddChild}>
              Add
            </button>
            <button
              className="confirm-button"
              onClick={() => {
                setNewChildName('');
                setIsAddingChild(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Render children */}
      {node.isExpanded && node.children && (
        <div className="tree-children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onAdd={onAdd}
              onRemove={onRemove}
              onEdit={onEdit}
              onLoadLazy={onLoadLazy}
              dragState={dragState}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}
