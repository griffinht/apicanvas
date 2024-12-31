import { ReactFlowInstance } from '@xyflow/react';
import { createHeaderNode } from '../Headers';

const mockHeaders = [
  { name: 'Content-Type', value: 'application/json', required: true, description: 'Response content type' },
  { name: 'Authorization', value: 'Bearer token', required: true, description: 'Authentication token' },
  { name: 'Accept', value: 'application/json', required: false, description: 'Accepted response type' },
  { name: 'X-API-Key', value: 'string', required: true, description: 'API key for authentication' },
  { name: 'Cache-Control', value: 'no-cache', required: false, description: 'Caching directives' }
];

export function createRandomHeader(
  nodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false
) {
  const header = mockHeaders[Math.floor(Math.random() * mockHeaders.length)];
  return createHeaderNode(
    header.name,
    header.value,
    header.required,
    header.description,
    nodeId,
    rfInstance,
    isHidden
  );
}
