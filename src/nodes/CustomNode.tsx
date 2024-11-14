import { Handle, Position, type NodeProps, useReactFlow, Edge } from '@xyflow/react';
import { useState, useRef, useEffect } from 'react';
import { useNodeRemove } from '../hooks/useNodeRemove';
import { CustomNodeData, OpenAPINode } from './types';

const getOpenAPINodes = (getEdges: () => Edge[], id: string): any => {
    const edges = getEdges().filter(edge => edge.source === id);
    
    console.log(edges);
    // Get all direct child nodes
    const childNodeIds = edges.map(edge => edge.target);
    // dont forget the delete elements??
}

const maximizeNode = (id: string) => {
    // todo

    // input all child openapi nodes
    // output all CustomNode - ALL - recursive!
    // remove all children, since they are all real nodes now

    // separate adding the nodes from making the nodes to add

    /*
    https://reactflow.dev/examples/nodes/add-node-on-edge-drop
    dynamic edge add? no need to add edges, just add nodes
    */

    // make a ton of new nodes
    //node.data.children = [];
    //addNodes
    //addEdges
}
const minimizeNode = (id: string) => {
    // todo

    // input all direct children
    // output openapi node for each child, as well as delete the old child
    // note that each openapi node recursively contains all children

    // separate getting the data from deleting the children


    //node.data.children = getOpenAPINodes(getEdges, id);
    // just pass in the parent node, all the children will be included
    //deleteElements https://reactflow.dev/api-reference/types/delete-elements
}


export function CustomNode({
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<CustomNodeData>) {
  const { addNodes, addEdges, getNodes, getEdges, deleteElements, setNodes, setEdges } = useReactFlow();
  const { canRemove, handleRemove } = useNodeRemove(id);
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(false);//data.data.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const [minimized, setMinimized] = useState(false);//data.data.minimized);

  // Add handler for saving the label
  const handleLabelSave = () => {
    //data.data.label = labelText;
    setIsEditing(false);
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSave();
    }
  };

  useEffect(() => {
    console.log('i was minimized', minimized, data.data.label);
  }, [minimized]);

  const handleMinimize = () => {
    const newMinimized = !minimized;
    //data.data.minimized = newMinimized;
    setMinimized(newMinimized);

    getOpenAPINode(getEdges, id);
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
    console.log('i was minimized', data.data.minimized);
  }, [data.data.minimized]);

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