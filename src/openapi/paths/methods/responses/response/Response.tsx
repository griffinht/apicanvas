import { ReactFlowInstance } from '@xyflow/react';

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

export function createResponseNode(
  statusCode: string,
  description: string,
  nodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false
) {
  return {
    id: nodeId,
    data: {
      label: <ResponseNode
        statusCode={statusCode}
        description={description}
        nodeId={nodeId}
        rfInstance={rfInstance}
      />
    },
    type: 'default',
    position: { x: 0, y: 0 },
    hidden: isHidden,
    style: getResponseNodeStyle(statusCode)
  };
}

const mockResponses = [
  { code: '200', description: 'Successful operation' },
  { code: '201', description: 'Resource created' },
  { code: '202', description: 'Request accepted' },
  { code: '400', description: 'Bad request' },
  { code: '401', description: 'Unauthorized' },
  { code: '403', description: 'Forbidden' },
  { code: '404', description: 'Resource not found' },
  { code: '500', description: 'Internal server error' },
  { code: '503', description: 'Service unavailable' }
];

export function createRandomResponse(
  nodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false
) {
  const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  return createResponseNode(
    response.code,
    response.description,
    nodeId,
    rfInstance,
    isHidden
  );
}
