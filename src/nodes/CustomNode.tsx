import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { useState, useRef, useEffect } from 'react';
import { useNodeRemove } from '../hooks/useNodeRemove';

const getRandomMethod = () => {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  return methods[Math.floor(Math.random() * methods.length)];
};

const getRandomNodeData = () => {
  // Alternate between method and endpoint nodes
  const isMethod = Math.random() < 0.5;
  
  if (isMethod) {
    return {
      label: getRandomMethod(),
      type: 'method'
    };
  } else {
    return {
      label: 'new-endpoint',
      type: 'endpoint'
    };
  }
};

export function CustomNode({
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<CustomNodeData>) {
  const { addNodes, addEdges } = useReactFlow();
  const { canRemove, handleRemove } = useNodeRemove(id);

  const createNewNode = () => {
    const newNodeId = `node-${Math.random()}`;
    const nodeData = getRandomNodeData();
    
    addNodes([{ 
      id: newNodeId,
      type: 'custom-node',
      position: { 
        x: positionAbsoluteX + 200, 
        y: positionAbsoluteY
      },
      data: nodeData,
    }]);

    addEdges([{ 
      id: `edge-${Math.random()}`,
      source: id,
      target: newNodeId,
    }]);
  };

  return (
    <div className="react-flow__node-default custom-node">
      <div>{data.label}</div>
      <div className="node-buttons">
        {data.type !== 'method' && (
          <button onClick={createNewNode} title="Add new node">+</button>
        )}
        <button onClick={handleRemove} disabled={!canRemove()} title="Remove node">×</button>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
} 