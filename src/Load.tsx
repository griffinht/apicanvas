import { ReactFlowInstance } from '@xyflow/react';
import { getLayoutedElements } from './Layout';
import { MethodNode } from './nodes/method/Method';
import { PathNode } from './nodes/path/Path';

export const setPaths = (paths: any, direction: 'TB' | 'LR', rfInstance: ReactFlowInstance) => {
  // Create nodes from paths
  const nodes: any[] = [];
  const edges: any[] = [];

  // Process each path
  Object.entries(paths).forEach(([path, pathItem]: [string, any]) => {
    // Split path into segments and create nodes for each
    const segments = path.split('/').filter(Boolean);
    let parentPath = '';
    let parentId = '';

    segments.forEach((segment, index) => {
      const nodeId = segment.startsWith('{') ? segment.slice(1, -1) : segment;
      
      // Add path node if it doesn't exist
      if (!nodes.find(n => n.id === nodeId)) {
        nodes.push({
          id: nodeId,
          data: { 
            label: <PathNode segment={segment} nodeId={nodeId} rfInstance={rfInstance} direction={direction} />
          },
          type: 'default',
          position: { x: 0, y: 0 }
        });
      }

      // Connect to parent path
      if (parentId) {
        const edgeId = `e-${parentId}-${nodeId}`;
        if (!edges.find(e => e.id === edgeId)) {
          edges.push({
            id: edgeId,
            source: parentId,
            target: nodeId,
            type: 'smoothstep',
            animated: true
          });
        }
      }

      // Add method nodes
      if (index === segments.length - 1) {
        Object.keys(pathItem).forEach(method => {
          if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
            const methodNodeId = `${nodeId}-${method}`;
            nodes.push({
              id: methodNodeId,
              data: { 
                label: <MethodNode method={method} nodeId={methodNodeId} />
              },
              type: 'default',
              position: { x: 0, y: 0 }
            });

            edges.push({
              id: `e-${nodeId}-${method}`,
              source: nodeId,
              target: methodNodeId,
              type: 'smoothstep',
              animated: true
            });
          }
        });
      }

      parentId = nodeId;
    });
  });

  return getLayoutedElements(nodes, edges, direction);
};
