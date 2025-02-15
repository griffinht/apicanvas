import { ReactFlowInstance } from "@xyflow/react";

// Store the currently highlighted path
let currentHighlightedPath: string | null = null;

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

// Function to clear the current highlight
export const clearHighlight = () => {
  if (currentHighlightedPath) {
    (window as any).clearHighlight?.();
    currentHighlightedPath = null;
  }
};

const highlightPath = (segment: string, nodeId: string, rfInstance: ReactFlowInstance) => {
  const fullPath = getFullPath(segment, nodeId, rfInstance);
  
  // If this path is already highlighted, do nothing
  if (currentHighlightedPath === fullPath) {
    return;
  }

  // Clear any existing highlight
  clearHighlight();

  // Set the new highlight
  currentHighlightedPath = fullPath;
  (window as any).highlightPath?.(fullPath);
};

export default highlightPath;