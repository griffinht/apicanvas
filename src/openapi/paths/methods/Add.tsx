import { ReactFlowInstance, Edge } from '@xyflow/react';
import { createMethodNode } from './Method';
import { getLayoutedElements } from '../../../Layout';

export function addMethodNode(parentId: string, rfInstance: ReactFlowInstance, direction: 'TB' | 'LR') {
  const nodes = rfInstance.getNodes();
  const edges = rfInstance.getEdges();
  
  // Generate unique ID for new method node
  const methodNodeId = `${parentId}-method`;
  
  // Create method node and its associated nodes
  const newNodes = createMethodNode('GET', methodNodeId, rfInstance, direction, false, parentId);

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
    // Edge to header
    {
      id: `e-${methodNodeId}-header`,
      source: methodNodeId,
      target: `${methodNodeId}-header`,
      type: 'smoothstep',
      animated: true
    },
    // Edge to parameter
    {
      id: `e-${methodNodeId}-param`,
      source: methodNodeId,
      target: `${methodNodeId}-param`,
      type: 'smoothstep',
      animated: true
    },
    // Edge to response
    {
      id: `e-${methodNodeId}-response`,
      source: methodNodeId,
      target: `${methodNodeId}-response`,
      type: 'smoothstep',
      animated: true
    }
  ];

  // Apply layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    [...nodes, ...newNodes],
    [...edges, ...newEdges],
    direction
  );

  // Update flow
  rfInstance.setNodes(layoutedNodes);
  rfInstance.setEdges(layoutedEdges);
} 