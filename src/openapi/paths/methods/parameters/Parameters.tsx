import { ReactFlowInstance, Node } from '@xyflow/react';
import { createRandomParameter } from './parameter/Parameter';

export interface ParameterNodeProps {
  name: string;
  type: string;
  required: boolean;
  description: string;
  rfInstance: ReactFlowInstance;
}

export function getParameterNodeStyle() {
  return {
    background: '#fff',
    border: '1px solid #805AD5', // Purple for parameters
    padding: '8px 12px',
    borderRadius: '4px',
    minWidth: '120px',
  };
}

export function ParameterNode({ name, type, required, description }: ParameterNodeProps) {
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
          {type}
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

export function createParameterNode(
  name: string,
  type: string,
  required: boolean,
  description: string,
  nodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false
): Node {
  return {
    id: nodeId,
    data: {
      label: <ParameterNode
        name={name}
        type={type}
        required={required}
        description={description}
        rfInstance={rfInstance}
      />
    },
    type: 'default',
    position: { x: 0, y: 0 },
    hidden: isHidden,
    style: getParameterNodeStyle()
  };
}

export function ParametersNode() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <span style={{ fontWeight: 'bold', color: '#2D3748' }}>
        Parameters
      </span>
    </div>
  );
}

export function createParameterNodes(
  baseNodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false
): Node[] {
  // Create parent "Parameters" node
  const parametersNode: Node = {
    id: baseNodeId,
    data: {
      label: <ParametersNode />
    },
    type: 'default',
    position: { x: 0, y: 0 },
    hidden: isHidden,
    style: getParameterNodeStyle()
  };

  // Create 0-3 child parameter nodes
  const count = Math.floor(Math.random() * 4); // 0-3 parameters
  const childNodes = Array.from({ length: count }, (_, i) => 
    createRandomParameter(
      `${baseNodeId}-${i + 1}`,
      rfInstance,
      isHidden
    )
  );

  return [parametersNode, ...childNodes];
}