import type { NodeTypes } from '@xyflow/react';

import { CustomNode } from './CustomNode';
import { AppNode } from './types';
import { PathNode } from './PathNode';
import { PathItem } from '../types/openapi';

export const initialNodes = (rootPath: PathItem): AppNode[] => [
  { id: 'a', type: 'input', position: { x: 0, y: 0 }, data: { label: 'wire' } },
  {
    id: 'b',
    type: 'custom-node',
    position: { x: -100, y: 100 },
    data: { label: '/sdasd' },
  },
  { id: 'c', position: { x: 100, y: 100 }, data: { label: 'your ideas' } },
  {
    id: 'd',
    type: 'output',
    position: { x: 0, y: 200 },
    data: { label: 'with React Flow' },
  },
  {
    id: 'root',
    type: 'path-node',
    position: { x: 0, y: -100 },
    data: rootPath
  },
];

export const nodeTypes = {
  'custom-node': CustomNode,
  'path-node': PathNode,
} satisfies NodeTypes;
