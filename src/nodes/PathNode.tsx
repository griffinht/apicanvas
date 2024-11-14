import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { useState, useRef, useEffect } from 'react';
import { useNodeRemove } from '../hooks/useNodeRemove';
import { PathNodeData } from './types';

export function PathNode({
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<PathNodeData>) {
  const { addNodes, addEdges, getNodes, getEdges, deleteElements, setNodes, setEdges } = useReactFlow();
  const { canRemove, handleRemove } = useNodeRemove(id);
  const [isMinimized, setIsMinimized] = useState(false);

  const removeChildNodes = () => {
    const edges = getEdges();
    const descendantIds = new Set<string>();
    
    const queue = [id];
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      edges.forEach(edge => {
        if (edge.source === currentId) {
          descendantIds.add(edge.target);
          queue.push(edge.target);
        }
      });
    }

    deleteElements({
      nodes: Array.from(descendantIds).map(nodeId => ({ id: nodeId })),
      edges: edges.filter(edge => 
        descendantIds.has(edge.source) || descendantIds.has(edge.target)
      ),
    });
  };

  const handleMinimizeToggle = () => {
    if (!isMinimized) {
      removeChildNodes();
    }
    setIsMinimized(!isMinimized);
  };

  const createNewNode = () => {
    const newNodeId = `node-${Math.random()}`;
    
    addNodes([{ 
      id: newNodeId,
      type: 'path-node',
      position: { 
        x: positionAbsoluteX + 200, 
        y: positionAbsoluteY
      },
      data: { path: 'hi' },
    }]);

    addEdges([{ 
      id: `edge-${Math.random()}`,
      source: id,
      target: newNodeId,
    }]);
  };

  return (
    <div className={`react-flow__node-default path-node ${isMinimized ? 'minimized' : ''}`}>
      <div className="node-header">
        <div>{data.path}</div>
        <div className="node-buttons">
          <button onClick={handleMinimizeToggle} title={isMinimized ? "Maximize" : "Minimize"}>
            {isMinimized ? '□' : '−'}
          </button>
          {!isMinimized && (
            <button onClick={createNewNode} title="Add new node">+</button>
          )}
          <button onClick={handleRemove} disabled={!canRemove()} title="Remove node">×</button>
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
} 