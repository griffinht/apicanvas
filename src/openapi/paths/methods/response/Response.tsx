import { ReactFlowInstance, Node, Edge } from '@xyflow/react';
import { useState } from 'react';

export interface ResponseNodeProps {
  statusCode: string;
  description: string;
  nodeId: string;
  rfInstance: ReactFlowInstance;
  schema?: any;
  contentType?: string;
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
    minWidth: '300px',
    maxWidth: '400px',
  };
}

function parseSchema(obj: any): string {
  if (obj.$ref) {
    return `${obj.$ref.split('/').pop()}`;
  }
  if (obj.type === 'array' && obj.items?.$ref) {
    return `Array<${obj.items.$ref.split('/').pop()}>`;
  }
  if (obj.type === 'string' || obj.type === 'number' || obj.type === 'integer' || obj.type === 'boolean') {
    return obj.format ? `${obj.type} (${obj.format})` : obj.type;
  }
  if (obj.type === 'object' && obj.properties) {
    return `{ ${Object.entries(obj.properties)
      .map(([key, value]: [string, any]) => `${key}: ${parseSchema(value)}`)
      .join(', ')} }`;
  }
  return 'unknown';
}

export function ResponseNode({ statusCode, description, schema, contentType }: ResponseNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Status Code Section - Always visible */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{
          transform: `rotate(${isExpanded ? '90deg' : '0deg'})`,
          transition: 'transform 0.2s',
        }}>
          ▶
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flex: 1,
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
      </div>

      {/* Collapsible Details Section */}
      {isExpanded && schema && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginLeft: '24px', // Indent the details
        }}>
          {/* TODO Note */}
          <div style={{
            color: '#ED8936',
            fontSize: '0.8em',
            backgroundColor: '#FEEBC8',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>⚠️</span>
            <span>todo we are missing response headers and probably other stuff, also what about xml responses??</span>
          </div>

          {/* Media Type */}
          {contentType && (
            <div style={{ 
              color: '#718096',
              fontSize: '0.9em',
              backgroundColor: '#EDF2F7',
              padding: '2px 6px',
              borderRadius: '4px',
              width: 'fit-content'
            }}>
              {contentType}
            </div>
          )}

          {/* Schema Value */}
          <div style={{
            backgroundColor: '#EBF8FF',
            padding: '8px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.9em',
            color: '#4299E1'
          }}>
            {parseSchema(schema)}
          </div>
        </div>
      )}
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
  const schema = Math.random() > 0.5 ? generateRandomSchema() : undefined;
  const contentType = schema ? 'application/json' : undefined;

  const responseNode = {
    id: nodeId,
    data: {
      label: <ResponseNode
        statusCode={statusCode}
        description={description}
        nodeId={nodeId}
        rfInstance={rfInstance}
        schema={schema}
        contentType={contentType}
      />,
      statusCode
    },
    type: 'default',
    position: { x: 0, y: 0 },
    hidden: isHidden,
    style: getResponseNodeStyle(statusCode)
  };

  return {
    nodes: [responseNode],
    edges: []
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
