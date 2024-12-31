import { Node, Edge, ReactFlowInstance } from '@xyflow/react';
import { MethodNode } from './Method';
import { getLayoutedElements } from '../../../Layout';

let methodIdCounter = 1;

export function addMethodNode(parentId: string, rfInstance: ReactFlowInstance, direction: 'TB' | 'LR') {
  const nodes = rfInstance.getNodes();
  const edges = rfInstance.getEdges();
  
  // Generate unique ID for new node
  const newNodeId = `method-${methodIdCounter++}`;
  
  // Create new node
  const newNode: Node = {
    id: newNodeId,
    type: 'default',
    data: {
      label: <MethodNode method="GET" nodeId={newNodeId} rfInstance={rfInstance} direction={direction} />
    },
    position: { x: 0, y: 0 }
  };

  // Create edge connecting to parent
  const newEdge: Edge = {
    id: `e-${parentId}-${newNodeId}`,
    source: parentId,
    target: newNodeId,
    type: 'smoothstep',
    animated: true
  };

  // Apply layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    [...nodes, newNode],
    [...edges, newEdge],
    direction
  );

  // Update flow
  rfInstance.setNodes([...layoutedNodes]);
  rfInstance.setEdges([...layoutedEdges]);
} 