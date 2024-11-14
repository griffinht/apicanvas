import type { Node, BuiltInNode } from '@xyflow/react';
import type { PathItem } from '../types/openapi';

export type CustomNodeData = Node<{ label: string }, 'custom-node'>;
export type PathNodeData = Node<PathItem, 'path-node'>;
export type AppNode = BuiltInNode | CustomNodeData | PathNodeData;
