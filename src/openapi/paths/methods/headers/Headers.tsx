import { ReactFlowInstance, Node } from '@xyflow/react';
import { createRandomHeader } from './header/Header';

export interface HeaderNodeProps {
  name: string;
  value: string;
  required: boolean;
  description: string;
  rfInstance: ReactFlowInstance;
}

export function getHeaderNodeStyle() {
  return {
    background: '#fff',
    border: '1px solid #3182CE', // Blue for headers
    padding: '8px 12px',
    borderRadius: '4px',
    minWidth: '120px',
  };
}

export function HeaderNode({ name, value, required, description }: HeaderNodeProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ fontWeight: 'bold', color: '#2D3748' }}>
          {name}
          {required && <span style={{ color: '#E53E3E', marginLeft: '2px' }}>*</span>}
        </span>
        <span style={{
          fontSize: '0.8em',
          color: '#718096',
          padding: '2px 6px',
          backgroundColor: '#EDF2F7',
          borderRadius: '4px',
        }}>
          {value}
        </span>
      </div>
      {description && (
        <div style={{ fontSize: '0.9em', color: '#4A5568' }}>
          {description}
        </div>
      )}
    </div>
  );
}

export function HeadersNode() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <span style={{ fontWeight: 'bold', color: '#2D3748' }}>
        Headers
      </span>
    </div>
  );
}

export function createHeaderNode(
  name: string,
  value: string,
  required: boolean,
  description: string,
  nodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false
): Node {
  return {
    id: nodeId,
    data: {
      label: <HeaderNode
        name={name}
        value={value}
        required={required}
        description={description}
        rfInstance={rfInstance}
      />
    },
    type: 'default',
    position: { x: 0, y: 0 },
    hidden: isHidden,
    style: getHeaderNodeStyle()
  };
}

export function createHeaderNodes(
  baseNodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false
): Node[] {
  // Create parent "Headers" node
  const headersNode: Node = {
    id: baseNodeId,
    data: {
      label: <HeadersNode />
    },
    type: 'default',
    position: { x: 0, y: 0 },
    hidden: isHidden,
    style: getHeaderNodeStyle()
  };

  // Create 0-3 child header nodes
  const count = Math.floor(Math.random() * 4); // 0-3 headers
  const childNodes = Array.from({ length: count }, (_, i) => 
    createRandomHeader(
      `${baseNodeId}-${i + 1}`,
      rfInstance,
      isHidden
    )
  );

  return [headersNode, ...childNodes];
}