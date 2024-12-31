import { ReactFlowInstance } from '@xyflow/react';
import { createParameterNode } from '../Parameters';

const mockParameters = [
  { name: 'id', type: 'string', required: true, description: 'Resource identifier' },
  { name: 'name', type: 'string', required: false, description: 'Resource name' },
  { name: 'limit', type: 'integer', required: false, description: 'Number of items to return' },
  { name: 'offset', type: 'integer', required: false, description: 'Number of items to skip' },
  { name: 'filter', type: 'string', required: false, description: 'Filter criteria' },
  { name: 'sort', type: 'string', required: false, description: 'Sort criteria' }
];

export function createRandomParameter(
  nodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false
) {
  const param = mockParameters[Math.floor(Math.random() * mockParameters.length)];
  return createParameterNode(
    param.name,
    param.type,
    param.required,
    param.description,
    nodeId,
    rfInstance,
    isHidden
  );
}
