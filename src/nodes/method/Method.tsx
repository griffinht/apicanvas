import { ReactFlowInstance } from '@xyflow/react';
import { deleteMethodNode } from './Delete';
import { editMethod } from './Edit';

interface MethodNodeProps {
  method: string;
  nodeId: string;
  rfInstance: ReactFlowInstance;
  direction: 'TB' | 'LR'; 
}

export function MethodNode({ method, nodeId, rfInstance, direction }: MethodNodeProps) {
  return (
    <div>
      <select 
        defaultValue={method.toUpperCase()}
        onChange={(e) => editMethod(nodeId, e.target.value, rfInstance, direction)}
        onClick={(e) => e.stopPropagation()}
    >
      <option value="GET">GET</option>
      <option value="POST">POST</option>
      <option value="PUT">PUT</option>
      <option value="DELETE">DELETE</option>
        <option value="PATCH">PATCH</option>
      </select>
      <button onClick={() => deleteMethodNode(nodeId, rfInstance, direction)}>X</button>
    </div>
  );
} 