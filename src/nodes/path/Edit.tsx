import { ReactFlowInstance } from '@xyflow/react';
import { PathNodeProps } from './types';

export function editPathSegment(nodeId: string, newSegment: string, rfInstance: ReactFlowInstance) {
  rfInstance.setNodes(nodes => nodes.map(node => {
    if (node.id === nodeId) {
      const props: PathNodeProps = {
        segment: newSegment,
        nodeId,
        rfInstance
      };
      return {
        ...node,
        data: {
          ...node.data,
          label: {
            type: 'default',
            props
          }
        }
      };
    }
    return node;
  }));
}
