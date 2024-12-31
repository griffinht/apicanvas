import { Node, Edge, Position } from '@xyflow/react';
import { positionPathNodes } from './nodes/path/Layout';

const nodeWidth = 200;
const nodeHeight = 60;

const positionSchemaNodes = (
  nodes: Node[],
  mainGraphBounds: { minX: number; maxX: number; minY: number; maxY: number },
  nodeWidth: number,
  nodeHeight: number,
  isHorizontal: boolean
): Node[] => {
  const schemaNodes = nodes.filter(node => node.id.startsWith('schema-'));
  
  return nodes.map(node => {
    if (!node.id.startsWith('schema-')) return node;
    
    const index = schemaNodes.findIndex(n => n.id === node.id);
    const position = {
      x: isHorizontal ? mainGraphBounds.maxX + 200 : mainGraphBounds.minX + (index * (nodeWidth + 50)),
      y: isHorizontal ? mainGraphBounds.minY + (index * (nodeHeight + 50)) : mainGraphBounds.maxY + 200
    };
    
    return {
      ...node,
      position: {
        x: position.x - nodeWidth / 2,
        y: position.y - nodeHeight / 2
      },
      sourcePosition: isHorizontal ? Position.Left : Position.Top,
      targetPosition: isHorizontal ? Position.Right : Position.Bottom
    };
  });
};

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction: 'TB' | 'LR') => {
  // Position path nodes first
  const { nodes: positionedPathNodes, mainGraphBounds } = positionPathNodes(nodes, edges, direction);

  // Position schema nodes using the path bounds
  const schemaNodes = nodes.filter(node => node.id.startsWith('schema-'));
  const allNodes = [
    ...positionedPathNodes,
    ...positionSchemaNodes(schemaNodes, mainGraphBounds, nodeWidth, nodeHeight, direction === 'LR')
  ];

  return { nodes: allNodes, edges };
}; 