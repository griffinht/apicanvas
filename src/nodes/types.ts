import type { Node, BuiltInNode } from '@xyflow/react';

export type CustomNodeData = Node<{ label: string }, 'custom-node'>;
export type AppNode = BuiltInNode | CustomNodeData;
