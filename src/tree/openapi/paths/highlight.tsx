import { ReactFlowInstance } from "@xyflow/react";

// Function to get the full path for this node
const getFullPath = (segment: string, nodeId: string, rfInstance: ReactFlowInstance) => {
    const nodes = rfInstance.getNodes();
    const edges = rfInstance.getEdges();
    const pathSegments: string[] = [segment];
    let currentNodeId = nodeId;

    while (true) {
      const parentEdge = edges.find(edge => edge.target === currentNodeId);
      if (!parentEdge) break;
      
      currentNodeId = parentEdge.source;
      const parentNode = nodes.find(n => n.id === currentNodeId);
      if (!parentNode) break;

      const parentSegment = (parentNode.data?.label as { props: { segment: string } })?.props?.segment;
      if (!parentSegment) break;
      
      pathSegments.unshift(parentSegment);
    }

    return '/' + pathSegments.join('/');
  };

  const highlightPath = (segment: string, nodeId: string, rfInstance: ReactFlowInstance) => {
    (window as any).highlightPath(getFullPath(segment, nodeId, rfInstance));
  }

  export default highlightPath;