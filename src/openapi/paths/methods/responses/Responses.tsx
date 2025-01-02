import { ReactFlowInstance, Node } from '@xyflow/react';
import { createRandomResponse } from './code/ResponseCode';

export interface ResponsesNodeProps {
  nodeId: string;
  rfInstance: ReactFlowInstance;
}

export function getResponsesNodeStyle() {
  return {
    background: '#fff',
    border: '1px solid #2D3748',
    padding: '8px 12px',
    borderRadius: '4px',
    minWidth: '120px',
  };
}

export function ResponsesNode({ nodeId }: ResponsesNodeProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <span style={{ fontWeight: 'bold', color: '#2D3748' }}>
        Responses
      </span>
    </div>
  );
}

export function createResponseNodes(
  baseNodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false
): Node[] {
  // Create parent "Responses" node
  const responsesNode: Node = {
    id: baseNodeId,
    data: {
      label: <ResponsesNode 
        nodeId={baseNodeId}
        rfInstance={rfInstance}
      />
    },
    type: 'default',
    position: { x: 0, y: 0 },
    hidden: isHidden,
    style: getResponsesNodeStyle()
  };

  // Create 2-3 child response nodes
  const count = Math.floor(Math.random() * 2) + 2; // 2-3 responses
  const childNodes = Array.from({ length: count }, (_, i) => 
    createRandomResponse(
      `${baseNodeId}-${i + 1}`,
      rfInstance,
      isHidden
    )
  ).flat(); // Flatten the array since createRandomResponse returns Node[]

  return [responsesNode, ...childNodes];
}