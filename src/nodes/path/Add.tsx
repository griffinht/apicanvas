import { Node, Edge, ReactFlowInstance } from '@xyflow/react';
import { PathNode } from './Path';
import { getLayoutedElements } from '../../Layout';

let nodeIdCounter = 1;

export function addPathNode(parentId: string | null, rfInstance: ReactFlowInstance) {
  if (!rfInstance) throw new Error('ReactFlow instance not found');

  const nodes = rfInstance.getNodes();
  const edges = rfInstance.getEdges();
  
  // Generate unique ID for new node
  const newNodeId = `path-${nodeIdCounter++}`;
  
  // Create new node
  const newNode: Node = {
    id: newNodeId,
    type: 'default',
    data: {
      label: <PathNode segment="new-endpoint" nodeId={newNodeId} rfInstance={rfInstance} />
    },
    position: { x: 0, y: 0 } // Position will be set by layout
  };

  // Create edge if there's a parent
  let newEdges: Edge[] = [...edges];
  if (parentId) {
    newEdges.push({
      id: `e-${parentId}-${newNodeId}`,
      source: parentId,
      target: newNodeId,
      type: 'smoothstep',
      animated: true
    });
  }

  // Apply layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    [...nodes, newNode],
    newEdges,
    'TB'
  );

  // Update flow
  rfInstance.setNodes(layoutedNodes);
  rfInstance.setEdges(layoutedEdges);
} 