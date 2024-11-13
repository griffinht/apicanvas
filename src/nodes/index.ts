import type { NodeTypes } from '@xyflow/react';

import { CustomNode } from './CustomNode';
import { AppNode } from './types';

export const initialNodes: AppNode[] = [
  { id: 'a', type: 'input', position: { x: 0, y: 0 }, data: { label: 'wire' } },
  {
    id: 'b',
    type: 'custom-node',
    position: { x: -100, y: 100 },
    data: { label: '/' },
  },
  { id: 'c', position: { x: 100, y: 100 }, data: { label: 'your ideas' } },
  {
    id: 'd',
    type: 'output',
    position: { x: 0, y: 200 },
    data: { label: 'with React Flow' },
  },
];

export const nodeTypes = {
  'custom-node': CustomNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
