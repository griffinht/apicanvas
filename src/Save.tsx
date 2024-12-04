import { ReactFlowInstance } from '@xyflow/react';

export const getPaths = (rfInstance: ReactFlowInstance | null) => {
  if (!rfInstance) return {};
  
  const flowData = rfInstance.toObject();
  const paths: Record<string, any> = {};
  
  // Group nodes by their complete path
  const pathGroups: Record<string, any[]> = {};
  
  flowData.nodes.forEach((node: any) => {
    if (node.data.label.includes('GET') || 
        node.data.label.includes('POST') || 
        node.data.label.includes('PUT') || 
        node.data.label.includes('DELETE')) {
      // Build the complete path by traversing edges backwards
      let currentNodeId = node.id;
      const pathParts: string[] = [];
      
      while (true) {
        const parentEdge = flowData.edges.find((edge: any) => edge.target === currentNodeId);
        if (!parentEdge) break;
        
        const parentNode = flowData.nodes.find((n: any) => n.id === parentEdge.source);
        if (!parentNode) break;
        
        pathParts.unshift(parentNode.data.label);
        currentNodeId = parentNode.id;
      }

      const pathKey = pathParts.join('/');
      if (!pathGroups[pathKey]) {
        pathGroups[pathKey] = [];
      }
      pathGroups[pathKey].push({
        method: node.data.label.toLowerCase(),
        nodeId: node.id
      });
    }
  });

  // Convert groups to OpenAPI paths format
  Object.entries(pathGroups).forEach(([pathKey, methods]) => {
    const pathObject: Record<string, any> = {};
    
    methods.forEach(({ method }) => {
      pathObject[method] = {
        summary: `${method} ${pathKey}`,
        responses: {
          '200': {
            description: 'Successful operation'
          }
        }
      };
    });

    paths['/' + pathKey] = pathObject;
  });

  return paths;
}; 