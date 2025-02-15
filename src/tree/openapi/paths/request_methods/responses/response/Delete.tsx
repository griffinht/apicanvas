import { ReactFlowInstance } from '@xyflow/react';
import { getLayoutedElements } from '../../../../../Layout';

export function deleteResponseNode(nodeId: string, rfInstance: ReactFlowInstance, direction: 'TB' | 'LR') {
  const nodes = rfInstance.getNodes().filter(node => node.id !== nodeId);
  const edges = rfInstance.getEdges().filter(edge => 
    edge.source !== nodeId && edge.target !== nodeId
  );

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
  rfInstance.setNodes(layoutedNodes);
  rfInstance.setEdges(layoutedEdges);
}