import { ReactFlowInstance } from '@xyflow/react';
import { getLayoutedElements } from '../../Layout';

export function deletePathNode(nodeId: string, rfInstance: ReactFlowInstance, direction: 'TB' | 'LR') {
  // Get current nodes and edges
  const nodes = rfInstance.getNodes();
  const edges = rfInstance.getEdges();

  // Find all descendant nodes recursively
  const nodesToDelete = new Set<string>([nodeId]);
  let changed = true;
  while (changed) {
    changed = false;
    edges.forEach(edge => {
      if (nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target)) {
        nodesToDelete.add(edge.target);
        changed = true;
      }
    });
  }

  // If we're deleting more than one node, prompt for confirmation
  if (nodesToDelete.size > 1) {
    const confirmDelete = window.confirm(
      `This will delete ${nodesToDelete.size} nodes. Are you sure?`
    );
    if (!confirmDelete) return;
  }

  // Remove the target nodes and any connected edges
  const newNodes = nodes.filter(node => !nodesToDelete.has(node.id));
  const newEdges = edges.filter(edge => 
    !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target)
  );

  // Apply layout and update flow
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    newNodes,
    newEdges,
    direction
  );

  rfInstance.setNodes(layoutedNodes);
  rfInstance.setEdges(layoutedEdges);
}
