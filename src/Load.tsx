import { Node, Edge } from '@xyflow/react';
import dagre from '@dagrejs/dagre';

const nodeWidth = 150;
const nodeHeight = 40;

interface LayoutOptions {
  direction?: 'TB' | 'LR';
}

export const setPaths = (paths: any, options: LayoutOptions = { direction: 'LR' }) => {
  // Create initial nodes
  const initialNodes = [
    { id: 'users', data: { label: 'users' } },
    { id: 'userId', data: { label: '{userId}' } },
    { id: 'posts', data: { label: 'posts' } },
    { id: 'users-get', data: { label: 'GET' } },
    { id: 'users-post', data: { label: 'POST' } },
    { id: 'userId-get', data: { label: 'GET' } },
    { id: 'userId-put', data: { label: 'PUT' } },
    { id: 'userId-delete', data: { label: 'DELETE' } },
    { id: 'posts-get', data: { label: 'GET' } },
  ].map(node => ({ ...node, type: 'default', position: { x: 0, y: 0 } }));

  const initialEdges = [
    { id: 'e-users-get', source: 'users', target: 'users-get' },
    { id: 'e-users-post', source: 'users', target: 'users-post' },
    { id: 'e-users-userId', source: 'users', target: 'userId' },
    { id: 'e-userId-get', source: 'userId', target: 'userId-get' },
    { id: 'e-userId-put', source: 'userId', target: 'userId-put' },
    { id: 'e-userId-delete', source: 'userId', target: 'userId-delete' },
    { id: 'e-userId-posts', source: 'userId', target: 'posts' },
    { id: 'e-posts-get', source: 'posts', target: 'posts-get' }
  ].map(edge => ({ ...edge, type: 'smoothstep', animated: true }));

  return getLayoutedElements(initialNodes, initialEdges, options.direction);
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
}; 