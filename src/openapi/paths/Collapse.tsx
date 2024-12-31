import { ReactFlowInstance } from '@xyflow/react';
import { getLayoutedElements } from '../../Layout';

export function collapsePathNode(nodeId: string, rfInstance: ReactFlowInstance, direction: 'TB' | 'LR') {
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

  const descendantIds = findDescendants(nodeId);
  
  // Get the target node
  const targetNode = nodes.find(n => n.id === nodeId);
  const isCollapsing = !targetNode?.data.collapsed;

  if (isCollapsing) {
    // Save children state before collapsing
    const childrenState = nodes
      .filter(node => descendantIds.includes(node.id))
      .map(node => ({
        id: node.id,
        hidden: node.hidden,
        data: node.data
      }));
    console.log('Saving children state:', childrenState);

    // Update nodes visibility and store children state
    const newNodes = nodes.map(node => {
      if (node.id === nodeId) {
        return { 
          ...node, 
          data: { 
            ...node.data,
            collapsed: true,
            childrenState 
          }
        };
      }
      if (descendantIds.includes(node.id)) {
        return { ...node, hidden: true };
      }
      return node;
    });

    // Update edges
    const newEdges = edges.map(edge => {
      if (descendantIds.includes(edge.target) || 
          (descendantIds.includes(edge.source) && edge.source !== nodeId)) {
        return { ...edge, hidden: true };
      }
      return edge;
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges,
      direction
    );

    rfInstance.setNodes(layoutedNodes);
    rfInstance.setEdges(layoutedEdges);

  } else {
    // Expanding - restore children state
    console.log('Restoring children state:', targetNode?.data.childrenState);

    const newNodes = nodes.map(node => {
      if (node.id === nodeId) {
        return { 
          ...node, 
          data: { 
            ...node.data,
            collapsed: false,
            childrenState: undefined 
          }
        };
      }
      if (descendantIds.includes(node.id)) {
        // @ts-ignore
        const savedState = targetNode?.data.childrenState?.find(
          (state: any) => state.id === node.id
        );
        return { 
          ...node, 
          hidden: savedState?.hidden ?? false,
          data: savedState?.data ?? node.data
        };
      }
      return node;
    });

    const newEdges = edges.map(edge => {
      if (descendantIds.includes(edge.target) || 
          (descendantIds.includes(edge.source) && edge.source !== nodeId)) {
        return { ...edge, hidden: false };
      }
      return edge;
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges,
      direction
    );

    rfInstance.setNodes(layoutedNodes);
    rfInstance.setEdges(layoutedEdges);
  }
}
