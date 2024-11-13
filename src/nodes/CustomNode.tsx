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

  const createNewEndpoint = (sourceId: string, sourceX: number, sourceY: number) => {
    const newNodeId = `node-${Math.random()}`;
    
    addNodes({
      id: newNodeId,
      type: 'custom-node',
      position: { 
        x: sourceX + 200, 
        y: sourceY
      },
      data: { label: 'New Endpoint' },
    });

    addEdges({
      id: `edge-${Math.random()}`,
      source: sourceId,
      target: newNodeId,
    });
  };

  const createNewMethod = (sourceId: string, sourceX: number, sourceY: number) => {
    const newNodeId = `node-${Math.random()}`;
    
    addNodes({
      id: newNodeId,
      type: 'custom-node',
      position: { 
        x: sourceX + 200, 
        y: sourceY
      },
      data: { label: 'New Method' },
    });

    addEdges({
      id: `edge-${Math.random()}`,
      source: sourceId,
      target: newNodeId,
    });
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
    <div className="react-flow__node-default custom-node">
      {data.label && <div>{data.label}</div>}
      <div className="node-buttons">
        <button 
          onClick={() => createNewEndpoint(id, positionAbsoluteX, positionAbsoluteY)}
          title="Add new endpoint"
        >
          +/
        </button>
        <button 
          onClick={() => createNewMethod(id, positionAbsoluteX, positionAbsoluteY)}
          title="Add HTTP method"
        >
          +M
        </button>
        <button 
          onClick={handleRemove}
          disabled={!canRemove()}
          title="Remove node"
        >
          ×
        </button>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
} 