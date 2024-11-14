import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { useState, useRef, useEffect } from 'react';
import { useNodeRemove } from '../hooks/useNodeRemove';
import { CustomNodeData, NodeData } from './types';

const getRandomMethod = () => {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  return methods[Math.floor(Math.random() * methods.length)];
};

const getRandomNodeData = (): NodeData => {
  // Alternate between method and endpoint nodes
  const isMethod = Math.random() < 0.5;
  
  if (isMethod) {
    return {
      label: getRandomMethod(),
      type: 'method',
      minimized: false
    };
  } else {
    return {
      label: 'new-endpoint', 
      type: 'endpoint',
      minimized: false
    };
  }
};

export function CustomNode({
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<CustomNodeData>) {
  const { addNodes, addEdges, getNodes, getEdges, deleteElements, setNodes, setEdges } = useReactFlow();
  const { canRemove, handleRemove } = useNodeRemove(id);
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(data.data.label);
  const [minimized, setMinimized] = useState(data.data.minimized);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add handler for saving the label
  const handleLabelSave = () => {
    data.data.label = labelText;
    setIsEditing(false);
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSave();
    }
  };

  const handleMinimize = () => {
    data.data.minimized = !minimized;
    setMinimized(!minimized);
  };


  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    console.log('labelText', labelText);
  }, [labelText]);

  useEffect(() => {
    console.log('i was minimized', minimized);
  }, [minimized]);

  const createNewNode = () => {
    const newNodeId = `node-${Math.random()}`;
    
    addNodes([{ 
      id: newNodeId,
      type: 'custom-node',
      position: { 
        x: positionAbsoluteX + 200, 
        y: positionAbsoluteY
      },
      data: {
        data: getRandomNodeData()
      }
    }]);

    addEdges([{ 
      id: `edge-${Math.random()}`,
      source: id,
      target: newNodeId,
    }]);
  };

  return (
    <div className={`react-flow__node-default custom-node`}>
      <div className="node-header">
        {isEditing && data.data.type === 'endpoint' ? (
          <input
            ref={inputRef}
            value={labelText}
            onChange={(e) => setLabelText(e.target.value)}
            onBlur={handleLabelSave}
            onKeyPress={handleKeyPress}
            className="node-input"
          />
        ) : (
          <div onDoubleClick={() => data.data.type === 'endpoint' && setIsEditing(true)}>
            {data.data.label}
          </div>
        )}
        <div className="node-buttons">
          <button onClick={handleMinimize} title={minimized ? "Maximize" : "Minimize"}>
            {minimized ? '□' : '−'}
          </button>
          <button onClick={createNewNode} title="Add new node">+</button>
          <button onClick={handleRemove} disabled={!canRemove()} title="Remove node">×</button>
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
} 