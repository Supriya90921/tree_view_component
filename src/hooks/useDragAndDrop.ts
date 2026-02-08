import { useState } from 'react';

export interface DragState {
  draggedId: string | null;
  dragOverId: string | null;
  dropPosition: 'before' | 'after' | 'inside' | null;
}

export function useDragAndDrop() {
  const [dragState, setDragState] = useState<DragState>({
    draggedId: null,
    dragOverId: null,
    dropPosition: null,
  });

  const handleDragStart = (nodeId: string) => {
    setDragState((prev) => ({ ...prev, draggedId: nodeId }));
  };

  const handleDragOver = (
    e: React.DragEvent,
    nodeId: string,
    position: 'before' | 'after' | 'inside'
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (dragState.draggedId === nodeId) return;

    setDragState((prev) => ({
      ...prev,
      dragOverId: nodeId,
      dropPosition: position,
    }));
  };

  const handleDragEnd = () => {
    setDragState({
      draggedId: null,
      dragOverId: null,
      dropPosition: null,
    });
  };

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
