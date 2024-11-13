import { Handle, Position, type NodeProps } from '@xyflow/react';

// Update the type import and rename the type
import { type CustomNodeData } from './types';

// Rename the component
export function CustomNode({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<CustomNodeData>) {
  const x = `${Math.round(positionAbsoluteX)}px`;
  const y = `${Math.round(positionAbsoluteY)}px`;

  return (
    <div className="react-flow__node-default custom-node">
      {data.label && <div>{data.label}</div>}
      <div>
        {x} {y}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
} 