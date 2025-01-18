import { ReactFlowInstance, Node, Edge } from '@xyflow/react';
import { deleteMethodNode } from './Delete';
import { editMethod } from './Edit';
import { createRandomResponse } from './response/Response';

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
): { nodes: Node[], edges: Edge[] } {
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

  // Create 1-3 response code nodes
  const responseCount = Math.floor(Math.random() * 3) + 1;
  const responses = Array.from({ length: responseCount }, (_, i) => 
    createRandomResponse(
      `${nodeId}-response-${i + 1}`,
      rfInstance,
      isHidden
    )
  );

  const allNodes: Node[] = [methodNode];
  const allEdges: Edge[] = [];

  responses.forEach(response => {
    allNodes.push(...response.nodes);
    allEdges.push(...response.edges);
    // Add edge from method to response
    allEdges.push({
      id: `${nodeId}-to-${response.nodes[0].id}`,
      source: nodeId,
      target: response.nodes[0].id,
      type: 'smoothstep',
    });
  });

  return {
    nodes: allNodes,
    edges: allEdges
  };
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