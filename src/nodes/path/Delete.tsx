import { ReactFlowInstance } from '@xyflow/react';
import { getLayoutedElements } from '../../Layout';

export function deletePathNode(nodeId: string, rfInstance: ReactFlowInstance) {
  // Get current nodes and edges
  const nodes = rfInstance.getNodes();
  const edges = rfInstance.getEdges();

  // Remove the target node and any connected edges
  const newNodes = nodes.filter(node => node.id !== nodeId);
  const newEdges = edges.filter(edge => 
    edge.source !== nodeId && edge.target !== nodeId
  );

  // Apply layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    newNodes,
    newEdges,
    'TB'
  );

  // Update flow
  rfInstance.setNodes(layoutedNodes);
  rfInstance.setEdges(layoutedEdges);
}
