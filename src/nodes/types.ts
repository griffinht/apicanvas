import type { Node, BuiltInNode } from '@xyflow/react';

export type NodeData = {
    label: string;
    type: 'method' | 'endpoint';
    minimized: boolean;
}
export type CustomNodeData = Node<{ data: NodeData }, 'custom-node'>;
export type AppNode = BuiltInNode | CustomNodeData;
