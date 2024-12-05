import { ReactFlowInstance } from '@xyflow/react';
import { getLayoutedElements } from '../../Layout';

export function deleteMethodNode(nodeId: string, rfInstance: ReactFlowInstance, direction: 'TB' | 'LR') {
  // Get current nodes and edges
  const nodes = rfInstance.getNodes();
  const edges = rfInstance.getEdges();

  // Remove the method node and any connected edges
  const newNodes = nodes.filter(node => node.id !== nodeId);
  const newEdges = edges.filter(edge => 
    edge.source !== nodeId && edge.target !== nodeId
  );

  // Apply layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    newNodes,
    newEdges,
    direction
  );

  // Update flow
  rfInstance.setNodes(layoutedNodes);
  rfInstance.setEdges(layoutedEdges);
}
