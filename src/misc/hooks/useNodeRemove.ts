import { useReactFlow } from '@xyflow/react';

export function useNodeRemove(nodeId: string) {
  const { deleteElements, getEdges } = useReactFlow();
  
  const canRemove = () => {
    const edges = getEdges();
    return !edges.some(edge => edge.source === nodeId);
  };

  const handleRemove = () => {
    if (!canRemove()) {
      alert('Please remove child nodes first');
      return;
    }
    deleteElements({
      nodes: [{ id: nodeId }],
      edges: [],
    });
  };

  return {
    canRemove,
    handleRemove,
  };
} 