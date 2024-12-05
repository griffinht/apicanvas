import { ReactFlowInstance } from '@xyflow/react';
import { MethodNode } from './nodes/method/Method';
import { PathNode } from './nodes/path/Path';

export const getPaths = (rfInstance: ReactFlowInstance) => {
  const flowData = rfInstance.toObject();
  const paths: Record<string, any> = {};
  const pathGroups: Record<string, any[]> = {};
  
  flowData.nodes.forEach((node: any) => {
    // Check if this is a method node by checking if it has a method prop
    const methodProps = node.data.label.props;
    const isMethodNode = methodProps && 'method' in methodProps;
    
    if (isMethodNode) {
      const method = methodProps.method.toLowerCase();
      
      // Build the complete path by traversing edges backwards
      let currentNodeId = node.id;
      const pathParts: string[] = [];
      
      while (true) {
        const parentEdge = flowData.edges.find((edge: any) => edge.target === currentNodeId);
        if (!parentEdge) break;
        
        const parentNode = flowData.nodes.find((n: any) => n.id === parentEdge.source);
        if (!parentNode) break;
        
        // Get the segment from the parent node's props
        const segment = parentNode.data.label.props.segment;
        pathParts.unshift(segment);
        currentNodeId = parentNode.id;
      }

      const pathKey = pathParts.join('/');
      if (!pathGroups[pathKey]) {
        pathGroups[pathKey] = [];
      }
      pathGroups[pathKey].push({
        method,
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