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
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return '#4CAF50';
      case 'POST': return '#FFC107';
      case 'PUT': return '#2196F3';
      case 'DELETE': return '#F44336';
      case 'PATCH': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  return (
    <div style={{ 
      backgroundColor: getMethodColor(method),
      padding: '8px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <select 
        defaultValue={method.toUpperCase()}
        onChange={(e) => editMethod(nodeId, e.target.value, rfInstance, direction)}
        onClick={(e) => e.stopPropagation()}
        style={{ 
          backgroundColor: 'transparent',
          color: method.toUpperCase() === 'POST' ? 'black' : 'white',
          border: 'none'
        }}
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