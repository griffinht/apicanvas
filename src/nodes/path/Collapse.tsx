import { ReactFlowInstance } from '@xyflow/react';
import { getLayoutedElements } from '../../Layout';

export function collapsePathNode(nodeId: string, rfInstance: ReactFlowInstance, direction: 'TB' | 'LR') {
  // Get current nodes and edges
  const nodes = rfInstance.getNodes();
  const edges = rfInstance.getEdges();
  
  // Find all descendant nodes recursively
  const findDescendants = (parentId: string): string[] => {
    const childEdges = edges.filter(edge => edge.source === parentId);
    const childIds = childEdges.map(edge => edge.target);
    
    return childIds.reduce((acc, childId) => {
      return [...acc, childId, ...findDescendants(childId)];
    }, [] as string[]);
  };

  // Get all descendants of the target node
  const descendantIds = findDescendants(nodeId);
  
  // Toggle visibility of descendants
  const newNodes = nodes.map(node => {
    if (descendantIds.includes(node.id)) {
      return {
        ...node,
        hidden: !node.hidden // Toggle the hidden state
      };
    }
    return node;
  });

  // Toggle visibility of connected edges
  const newEdges = edges.map(edge => {
    if (descendantIds.includes(edge.target) || descendantIds.includes(edge.source)) {
      return {
        ...edge,
        hidden: !edge.hidden // Toggle the hidden state
      };
    }
    return edge;
  });

  // Apply layout to visible nodes
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    newNodes,
    newEdges,
    direction
  );

  // Update flow
  rfInstance.setNodes(layoutedNodes);
  rfInstance.setEdges(layoutedEdges);
}
