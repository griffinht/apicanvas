import { ReactFlowInstance, Node, Edge } from '@xyflow/react';
import { useState } from 'react';
import { editResponseDescription } from './Edit';

export interface ResponseNodeProps {
  statusCode: string;
  description: string;
  nodeId: string;
  rfInstance: ReactFlowInstance;
  schema?: any;
  contentType?: string;
}

export function editResponseCode(nodeId: string, rfInstance: ReactFlowInstance) {
  const nodes = rfInstance.getNodes();
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return;
  
  const currentCode = node.data?.statusCode as string;
  const newCode = prompt('Enter new status code:', currentCode);
  
  if (!newCode || newCode === currentCode || !/^[1-5][0-9][0-9]$/.test(newCode)) {
    return;
  }

  rfInstance.setNodes(nodes.map(n => {
    if (n.id === nodeId) {
      const existingDescription = n.data.label.props.description;
      
      return {
        ...n,
        data: {
          ...n.data,
          statusCode: newCode,
          label: <ResponseNode
            statusCode={newCode}
            description={existingDescription}
            nodeId={nodeId}
            rfInstance={rfInstance}
            schema={n.data.schema}
            contentType={n.data.contentType}
          />
        },
        style: getResponseNodeStyle(newCode)
      };
    }
    return n;
  }));
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

export function ResponseNode({ statusCode, description, schema, contentType, nodeId, rfInstance }: ResponseNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div 
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
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        >
          ▶
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flex: 1,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            position: 'relative',
            minHeight: '24px',
          }}>
            <span style={{
              fontWeight: 'bold',
              color: '#2D3748',
            }}>
              {statusCode}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                editResponseCode(nodeId, rfInstance);
              }}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '2px 4px',
                fontSize: '0.9em',
                opacity: 0.6,
                transition: 'opacity 0.2s',
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                right: '0',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
            >
              ✏️
            </button>
          </div>
          <div style={{
            fontSize: '0.9em',
            color: '#4A5568',
            textAlign: 'center',
            position: 'relative',
            paddingRight: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '24px',
          }}>
            {description}
            <button
              onClick={(e) => {
                e.stopPropagation();
                editResponseDescription(nodeId, rfInstance);
              }}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '2px 4px',
                fontSize: '0.9em',
                opacity: 0.6,
                transition: 'opacity 0.2s',
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
            >
              ✏️
            </button>
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

export function createResponseNode(
  statusCode: string,
  description: string,
  nodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false,
  schema?: any,
  contentType?: string
): { nodes: Node[], edges: Edge[] } {
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
      statusCode,
      schema,
      contentType
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
