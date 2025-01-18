import { ReactFlowInstance } from '@xyflow/react';
import { ResponseNode } from './Response';
import { getResponseNodeStyle } from './Response';

export function editResponseCode(nodeId: string, rfInstance: ReactFlowInstance) {
  const nodes = rfInstance.getNodes();
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return;
  
  // Extract current status code from node data
  const currentCode = node.data?.statusCode;
  const newCode = prompt('Enter new status code:', currentCode);
  
  // Validate input is a valid status code
  if (!newCode || newCode === currentCode || !/^[1-5][0-9][0-9]$/.test(newCode)) {
    return;
  }

  // Get standard description for the status code
  const descriptions: { [key: string]: string } = {
    '200': 'OK',
    '201': 'Created',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '403': 'Forbidden',
    '404': 'Not Found',
    '500': 'Internal Server Error'
  };
  const description = descriptions[newCode] || 'Unknown Status Code';

  // Update the node
  rfInstance.setNodes(nodes.map(n => {
    if (n.id === nodeId) {
      return {
        ...n,
        data: {
          ...n.data,
          statusCode: newCode,
          label: <ResponseNode
            statusCode={newCode}
            description={description}
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