import { deleteMethodNode } from './Delete';
import { editMethod } from './Edit';

interface MethodNodeProps {
  method: string;
  nodeId: string;
}

export function MethodNode({ method, nodeId }: MethodNodeProps) {
  return (
    <div>
      <select 
        defaultValue={method.toUpperCase()}
        onChange={(e) => editMethod(nodeId, e.target.value)}
        onClick={(e) => e.stopPropagation()}
    >
      <option value="GET">GET</option>
      <option value="POST">POST</option>
      <option value="PUT">PUT</option>
      <option value="DELETE">DELETE</option>
        <option value="PATCH">PATCH</option>
      </select>
      <button onClick={() => deleteMethodNode(nodeId)}>X</button>
    </div>
  );
} 