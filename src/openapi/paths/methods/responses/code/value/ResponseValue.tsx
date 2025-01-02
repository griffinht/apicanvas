import { ReactFlowInstance, Node } from '@xyflow/react';

export interface ResponseValueNodeProps {
  contentType: string;
  schema: any;
  nodeId: string;
  rfInstance: ReactFlowInstance;
}

export function getResponseValueNodeStyle(): React.CSSProperties {
  return {
    background: '#fff',
    border: '1px solid #2D3748',
    padding: '8px 12px',
    borderRadius: '4px',
    minWidth: '300px',
    maxWidth: '400px',
    whiteSpace: 'normal' as const,
    wordBreak: 'break-word' as const
  };
}

export function ResponseValueNode({ contentType, schema }: ResponseValueNodeProps) {
  const parseSchema = (obj: any): string => {
    // Direct reference
    if (obj.$ref) {
      return `${obj.$ref.split('/').pop()}`;
    }

    // Array of references
    if (obj.type === 'array' && obj.items?.$ref) {
      return `Array<${obj.items.$ref.split('/').pop()}>`;
    }

    // Simple types
    if (obj.type === 'string' || obj.type === 'number' || obj.type === 'integer' || obj.type === 'boolean') {
      return obj.format ? `${obj.type} (${obj.format})` : obj.type;
    }

    // Object with properties
    if (obj.type === 'object' && obj.properties) {
      return `{ ${Object.entries(obj.properties)
        .map(([key, value]: [string, any]) => `${key}: ${parseSchema(value)}`)
        .join(', ')} }`;
    }

    return 'unknown';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '100%',
      textAlign: 'left',
      padding: '12px',
      backgroundColor: '#F7FAFC',
      borderRadius: '4px',
      border: '1px solid #E2E8F0'
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

      {/* Description */}
      <div style={{ 
        color: '#2D3748',
        fontSize: '0.9em'
      }}>
        {schema.description || 'No description provided'}
      </div>

      {/* Value */}
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
  );
}

export function createResponseValueNode(
  contentType: string,
  schema: any,
  nodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false
): Node {
  return {
    id: nodeId,
    data: {
      label: <ResponseValueNode
        contentType={contentType}
        schema={schema}
        nodeId={nodeId}
        rfInstance={rfInstance}
      />
    },
    type: 'default',
    position: { x: 0, y: 0 },
    hidden: isHidden,
    style: getResponseValueNodeStyle()
  };
}
