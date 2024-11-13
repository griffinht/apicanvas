import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

// Update the type import and rename the type
import { type CustomNodeData } from './types';

// Rename the component
export function CustomNode({
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<CustomNodeData>) {
  const { addNodes, addEdges, deleteElements, getEdges } = useReactFlow();
  
  const canRemove = () => {
    const edges = getEdges();
    return !edges.some(edge => edge.source === id);
  };

  const createNewConnectedNode = (sourceId: string, sourceX: number, sourceY: number) => {
    const newNodeId = `node-${Math.random()}`;
    
    addNodes({
      id: newNodeId,
      type: 'custom-node',
      position: { 
        x: sourceX + 200, 
        y: sourceY
      },
      data: { label: 'New Node' },
    });

    addEdges({
      id: `edge-${Math.random()}`,
      source: sourceId,
      target: newNodeId,
    });
  };
  
  const handleDoubleClick = () => {
    createNewConnectedNode(id, positionAbsoluteX, positionAbsoluteY);
  };

  const handleRemove = () => {
    if (!canRemove()) {
      alert('Please remove child nodes first');
      return;
    }
    deleteElements({
      nodes: [{ id }],
      edges: [],
    });
  };

  const x = `${Math.round(positionAbsoluteX)}px`;
  const y = `${Math.round(positionAbsoluteY)}px`;

  return (
    <div 
      className="react-flow__node-default custom-node"
      onDoubleClick={handleDoubleClick}
    >
      {data.label && <div>{data.label}</div>}
      <div>
        {x} {y}
      </div>
      <button 
        onClick={handleRemove}
        disabled={!canRemove()}
      >
        ×
      </button>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
} 