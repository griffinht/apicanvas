import { ReactFlowInstance, Edge } from '@xyflow/react';
import { createMethodNode } from './Method';
import { getLayoutedElements } from '../../../Layout';

export function addMethodNode(parentId: string, rfInstance: ReactFlowInstance, direction: 'TB' | 'LR') {
  const nodes = rfInstance.getNodes();
  const edges = rfInstance.getEdges();
  
  // Generate unique ID for new method node
  const methodNodeId = `${parentId}-method`;
  
  // Create method node and its associated nodes
  const { nodes: methodNodes, edges: methodEdges } = createMethodNode('GET', methodNodeId, rfInstance, direction, false, parentId);

  // Create edges to connect all nodes
  const newEdges: Edge[] = [
    // Edge from parent to method
    {
      id: `e-${parentId}-${methodNodeId}`,
      source: parentId,
      target: methodNodeId,
      type: 'smoothstep',
      animated: true
    },
    ...methodEdges
  ];

  // Apply layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    [...nodes, ...methodNodes],
    [...edges, ...newEdges],
    direction
  );

  // Update flow
  rfInstance.setNodes(layoutedNodes);
  rfInstance.setEdges(layoutedEdges);
} 