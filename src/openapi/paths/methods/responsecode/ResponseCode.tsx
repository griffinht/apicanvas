import { ReactFlowInstance, Node, Edge } from '@xyflow/react';
import { createResponseValueNode } from './value/ResponseValue';

export interface ResponseNodeProps {
  statusCode: string;
  description: string;
  nodeId: string;
  rfInstance: ReactFlowInstance;
}

export function getResponseNodeStyle(statusCode: string) {
  const getStatusColor = (code: string) => {
    const firstDigit = code.charAt(0);
    switch (firstDigit) {
      case '2': return '#48BB78'; // Green for success
      case '3': return '#4299E1'; // Blue for redirection
      case '4': return '#ECC94B'; // Yellow for client errors
      case '5': return '#F56565'; // Red for server errors
      default: return '#A0AEC0';  // Gray for unknown
    }
  };

  return {
    background: '#fff',
    border: `2px solid ${getStatusColor(statusCode)}`,
    padding: '8px 12px',
    borderRadius: '4px',
    minWidth: '120px',
  };
}

export function ResponseNode({ statusCode, description }: ResponseNodeProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}>
      <div style={{
        fontWeight: 'bold',
        color: '#2D3748',
      }}>
        {statusCode}
      </div>
      <div style={{
        fontSize: '0.9em',
        color: '#4A5568',
      }}>
        {description}
      </div>
    </div>
  );
}

function generateRandomSchema() {
  const schemas = [
    // Direct Pet reference
    {
      $ref: '#/components/schemas/Pet'
    },
    // Array of Pets
    {
      type: 'array',
      items: {
        $ref: '#/components/schemas/Pet'
      }
    },
    // Error object
    {
      type: 'object',
      properties: {
        code: { type: 'integer' },
        message: { type: 'string' }
      }
    },
    // Simple string
    {
      type: 'string',
      format: 'date-time'
    }
  ];

  return schemas[Math.floor(Math.random() * schemas.length)];
}

export function createResponseNode(
  statusCode: string,
  description: string,
  nodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false
): { nodes: Node[], edges: Edge[] } {
  const responseNode = {
    id: nodeId,
    data: {
      label: <ResponseNode
        statusCode={statusCode}
        description={description}
        nodeId={nodeId}
        rfInstance={rfInstance}
      />,
      statusCode
    },
    type: 'default',
    position: { x: 0, y: 0 },
    hidden: isHidden,
    style: getResponseNodeStyle(statusCode)
  };

  const valueNodes = Math.random() > 0.5 ? [
    createResponseValueNode(
      'application/json',
      generateRandomSchema(),
      `${nodeId}-value`,
      rfInstance,
      isHidden
    )
  ] : [];

  const edges = valueNodes.map(valueNode => ({
    id: `${nodeId}-to-${valueNode.id}`,
    source: nodeId,
    target: valueNode.id,
    type: 'smoothstep',
  }));

  return {
    nodes: [responseNode, ...valueNodes],
    edges
  };
}

export function createRandomResponse(
  nodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false
): { nodes: Node[], edges: Edge[] } {
  const statusCodes = ['200', '201', '400', '401', '403', '404', '500'];
  const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
  const descriptions = {
    '200': 'OK',
    '201': 'Created',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '403': 'Forbidden',
    '404': 'Not Found',
    '500': 'Internal Server Error'
  };

  return createResponseNode(
    statusCode,
    descriptions[statusCode as keyof typeof descriptions],
    nodeId,
    rfInstance,
    isHidden
  );
}
