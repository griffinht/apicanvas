import { ReactFlowInstance } from '@xyflow/react';
import { PathNodeProps } from './Path';
import { PathNode } from './Path';

export function editPathSegment(nodeId: string, newSegment: string, rfInstance: ReactFlowInstance, direction: 'TB' | 'LR') {
  rfInstance.setNodes(nodes => nodes.map(node => {
    if (node.id === nodeId) {
      const props: PathNodeProps = {
        segment: newSegment,
        nodeId,
        rfInstance,
        direction
      };
      return {
        ...node,
        data: {
          ...node.data,
          label: <PathNode {...props} />
        }
      };
    }
    return node;
  }));
}
