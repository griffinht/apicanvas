import { Node, Edge } from '@xyflow/react';
import dagre from '@dagrejs/dagre';

const nodeWidth = 200;
const nodeHeight = 60;

export const positionPathNodes = (
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR'
): { nodes: Node[], mainGraphBounds: any } => {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === 'LR';
  
  // Layout main graph
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50,
    ranksep: 100,
    edgesep: 50,
  });

  // Add non-schema nodes to graph
  const pathNodes = nodes.filter(node => !node.id.startsWith('schema-'));
  pathNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Apply layout
  dagre.layout(dagreGraph);

  // Position path nodes
  const positionedNodes = pathNodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      },
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      targetPosition: isHorizontal ? 'left' : 'top'
    };
  });

  // Calculate bounds
  const mainGraphBounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity
  };

  positionedNodes.forEach((node) => {
    const pos = node.position;
    mainGraphBounds.minX = Math.min(mainGraphBounds.minX, pos.x);
    mainGraphBounds.maxX = Math.max(mainGraphBounds.maxX, pos.x + nodeWidth);
    mainGraphBounds.minY = Math.min(mainGraphBounds.minY, pos.y);
    mainGraphBounds.maxY = Math.max(mainGraphBounds.maxY, pos.y + nodeHeight);
  });

  return { nodes: positionedNodes as Node[], mainGraphBounds };
}; 