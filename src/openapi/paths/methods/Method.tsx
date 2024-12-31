import { ReactFlowInstance, Node, Edge } from '@xyflow/react';
import { deleteMethodNode } from './Delete';
import { editMethod } from './Edit';
import { createHeaderNodes } from './headers/Headers';
import { createParameterNodes } from './parameters/Parameters';
import { createResponseNodes } from './responses/Responses';

export interface MethodNodeProps {
  method: string;
  nodeId: string;
  parentId?: string;
  rfInstance: ReactFlowInstance;
  direction: 'TB' | 'LR';
}

export function getMethodNodeStyle(method: string) {
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

  return {
    background: getMethodColor(method),
    padding: '4px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
  };
}

export function createMethodNode(
  method: string,
  nodeId: string,
  rfInstance: ReactFlowInstance,
  direction: 'TB' | 'LR',
  isHidden: boolean,
  parentId?: string
): Node[] {
  const methodNode = {
    id: nodeId,
    data: { 
      label: <MethodNode 
        method={method} 
        nodeId={nodeId}
        parentId={parentId}
        rfInstance={rfInstance} 
        direction={direction} 
      />,
      parentId
    },
    type: 'default',
    position: { x: 0, y: 0 },
    hidden: isHidden,
    style: getMethodNodeStyle(method)
  };

  const headerNodes = createHeaderNodes(
    `${nodeId}-header`,
    rfInstance,
    isHidden
  );

  const parameterNodes = createParameterNodes(
    `${nodeId}-param`,
    rfInstance,
    isHidden
  );

  const responseNodes = createResponseNodes(
    `${nodeId}-response`,
    rfInstance,
    isHidden
  );

  return [methodNode, ...headerNodes, ...parameterNodes, ...responseNodes];
}

export function MethodNode({ method, nodeId, rfInstance, direction }: MethodNodeProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      width: '100%',
      height: '100%',
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
      <button 
        onClick={() => deleteMethodNode(nodeId, rfInstance, direction)}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: method.toUpperCase() === 'POST' ? 'black' : 'white',
          cursor: 'pointer'
        }}
      >
        X
      </button>
    </div>
  );
} 