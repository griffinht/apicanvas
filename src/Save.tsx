import { ReactFlowInstance } from '@xyflow/react';

export const getPaths = (rfInstance: ReactFlowInstance) => {
  const flowData = rfInstance.toObject();
  const paths: Record<string, any> = {};

  // First, find all method nodes (they're our endpoints)
  const methodNodes = flowData.nodes.filter(node => {
    // @ts-ignore
    const props = node.data.label.props;
    return props && 'method' in props;
  });

  // For each method node, build its path by traversing up to root
  methodNodes.forEach(methodNode => {
    // @ts-ignore
    const method = methodNode.data.label.props.method.toLowerCase();
    const pathSegments: string[] = [];
    let currentNodeId = methodNode.id;

    // Traverse up the tree until we hit a root node
    while (true) {
      const parentEdge = flowData.edges.find(edge => edge.target === currentNodeId);
      if (!parentEdge) break;

      const parentNode = flowData.nodes.find(n => n.id === parentEdge.source);
      if (!parentNode) break;

      // Add the segment to our path
    // @ts-ignore
      const segment = parentNode.data.label.props.segment;
      pathSegments.unshift(segment);
      
      currentNodeId = parentNode.id;
    }

    // Build the full path
    const fullPath = '/' + pathSegments.join('/');

    // Initialize the path object if it doesn't exist
    if (!paths[fullPath]) {
      paths[fullPath] = {};
    }

    // Add the method to the path
    paths[fullPath][method] = {
      summary: `${method} ${fullPath}`,
      responses: {}
    };

    // Find all response nodes connected to this method node
    const responseEdges = flowData.edges.filter(edge => edge.source === methodNode.id);
    responseEdges.forEach(edge => {
      const responseNode = flowData.nodes.find(n => n.id === edge.target);
      if (!responseNode) return;

      // @ts-ignore
      const statusCode = responseNode.data.statusCode;
      // @ts-ignore
      const description = responseNode.data.label.props.description;
      // @ts-ignore
      const schema = responseNode.data.label.props.schema;
      // @ts-ignore
      const contentType = responseNode.data.label.props.contentType;

      paths[fullPath][method].responses[statusCode] = {
        description: description,
        ...(schema && contentType && {
          content: {
            [contentType]: {
              schema: schema
            }
          }
        })
      };
    });

    // Check if any segments in this path are collapsed
    pathSegments.reduce((currentPath, segment) => {
      const newPath = currentPath + '/' + segment;
      const nodeId = segment.startsWith('{') ? segment.slice(1, -1) : segment;
      const node = flowData.nodes.find(n => n.id === nodeId);
      
      if (node?.data.collapsed) {
        paths[newPath] = {
          ...paths[newPath],
          'x-collapsed': true
        };
      }
      
      return newPath;
    }, '');
  });

  return paths;
};