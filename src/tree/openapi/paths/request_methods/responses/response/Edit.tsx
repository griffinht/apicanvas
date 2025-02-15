import { ReactFlowInstance } from '@xyflow/react';
import { ResponseNode } from './ResponseCode';
import { getResponseNodeStyle } from './ResponseCode';

export function editResponseCode(nodeId: string, rfInstance: ReactFlowInstance) {
  const nodes = rfInstance.getNodes();
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return;
  
  // Extract current status code from node data
  const currentCode = node.data?.statusCode;
  const newCodeInput = prompt('Enter new status code:', currentCode?.toString());
  const newCode = newCodeInput?.toString();
  
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
            schema={n.data.schema as string | undefined}
            contentType={n.data.contentType as string | undefined}
          />
        },
        style: getResponseNodeStyle(newCode)
      };
    }
    return n;
  }));
}

export function editResponseDescription(nodeId: string, rfInstance: ReactFlowInstance) {
  const nodes = rfInstance.getNodes();
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return;
  
  // @ts-ignore
  const data = node.data as ResponseNodeData;
  const currentDescription = data.label.props.description;
  const newDescription = prompt('Enter new description:', currentDescription);
  
  if (!newDescription || newDescription === currentDescription) {
    return;
  }

  rfInstance.setNodes(nodes.map(n => {
    if (n.id === nodeId) {
      return {
        ...n,
        data: {
          ...n.data,
          label: <ResponseNode
            statusCode={data.statusCode}
            description={newDescription}
            nodeId={nodeId}
            rfInstance={rfInstance}
            schema={n.data.schema}
            contentType={data.contentType}
          />
        }
      };
    }
    return n;
  }));
} 