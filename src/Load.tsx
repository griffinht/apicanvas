import { ReactFlowInstance } from '@xyflow/react';
import { getLayoutedElements } from './Layout';
import { createMethodNode } from './openapi/paths/methods/Method';
import { createPathNode } from './openapi/paths/Path';
import { createSchemaNode, getMockSchemas } from './openapi/components/schemas/Schema';

export const setPaths = (paths: any, direction: 'TB' | 'LR', rfInstance: ReactFlowInstance) => {
  const nodes: any[] = [];
  const edges: any[] = [];
  const collapsedPaths = new Set<string>();

  // First pass: identify all collapsed paths
  Object.entries(paths).forEach(([path, pathItem]: [string, any]) => {
    if (pathItem['x-collapsed']) {
      collapsedPaths.add(path);
    }
  });

  // Process each path
  Object.entries(paths).forEach(([path, pathItem]: [string, any]) => {
    const segments = path.split('/').filter(Boolean);
    let parentId = '';
    let isChildOfCollapsed = false;

    // Check if this path is under any collapsed paths
    for (const collapsedPath of collapsedPaths) {
      if (path.startsWith(collapsedPath) && path !== collapsedPath) {
        isChildOfCollapsed = true;
        break;
      }
    }

    segments.forEach((segment, index) => {
      const nodeId = segment.startsWith('{') ? segment.slice(1, -1) : segment;
      const currentPath = '/' + segments.slice(0, index + 1).join('/');
      const isCollapsed = paths[currentPath]?.['x-collapsed'] === true;

      // Add path node if it doesn't exist
      if (!nodes.find(n => n.id === nodeId)) {
        nodes.push(createPathNode(
          segment,
          nodeId,
          rfInstance,
          direction,
          isChildOfCollapsed
        ));
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
            animated: true,
            hidden: isChildOfCollapsed
          });
        }
      }

      // Add method nodes at the leaf level
      if (index === segments.length - 1) {
        // @ts-ignore
        Object.entries(pathItem).forEach(([key, value]) => {
          if (['get', 'post', 'put', 'delete', 'patch'].includes(key)) {
            const methodNodeId = `${nodeId}-${key}`;
            nodes.push(...createMethodNode(
              key,
              methodNodeId,
              rfInstance,
              direction,
              isChildOfCollapsed || isCollapsed,
              nodeId
            ));

            edges.push({
              id: `e-${nodeId}-${methodNodeId}`,
              source: nodeId,
              target: methodNodeId,
              type: 'smoothstep',
              animated: true,
              hidden: isChildOfCollapsed || isCollapsed
            });

            // Add edges for header, parameter, and response nodes
            edges.push({
              id: `e-${methodNodeId}-header`,
              source: methodNodeId,
              target: `${methodNodeId}-header`,
              type: 'smoothstep',
              animated: true,
              hidden: isChildOfCollapsed || isCollapsed
            });

            edges.push({
              id: `e-${methodNodeId}-param`,
              source: methodNodeId,
              target: `${methodNodeId}-param`,
              type: 'smoothstep',
              animated: true,
              hidden: isChildOfCollapsed || isCollapsed
            });

            edges.push({
              id: `e-${methodNodeId}-response`,
              source: methodNodeId,
              target: `${methodNodeId}-response`,
              type: 'smoothstep',
              animated: true,
              hidden: isChildOfCollapsed || isCollapsed
            });

            // Add edges for child response nodes (2-3 random ones)
            const responseCount = Math.floor(Math.random() * 2) + 2; // 2-3 responses
            for (let i = 0; i < responseCount; i++) {
              const responseNodeId = `${methodNodeId}-response-${i + 1}`;
              edges.push({
                id: `e-${methodNodeId}-response-${i + 1}`,
                source: `${methodNodeId}-response`,
                target: responseNodeId,
                type: 'smoothstep',
                animated: true,
                hidden: isChildOfCollapsed || isCollapsed
              });
            }

            const headerCount = Math.floor(Math.random() * 4); // 0-3 headers
            for (let i = 0; i < headerCount; i++) {
              edges.push({
                id: `e-${methodNodeId}-header-${i + 1}`,
                source: `${methodNodeId}-header`,
                target: `${methodNodeId}-header-${i + 1}`,
                type: 'smoothstep',
                animated: true,
                hidden: isChildOfCollapsed || isCollapsed
              });
            }

            const paramCount = Math.floor(Math.random() * 4); // 0-3 parameters
            for (let i = 0; i < paramCount; i++) {
              edges.push({
                id: `e-${methodNodeId}-param-${i + 1}`,
                source: `${methodNodeId}-param`,
                target: `${methodNodeId}-param-${i + 1}`,
                type: 'smoothstep',
                animated: true,
                hidden: isChildOfCollapsed || isCollapsed
              });
            }

            // Add edges for response value nodes
            for (let i = 0; i < responseCount; i++) {
              const responseNodeId = `${methodNodeId}-response-${i + 1}`;
              edges.push({
                id: `e-${responseNodeId}-value`,
                source: responseNodeId,
                target: `${responseNodeId}-value`,
                type: 'smoothstep',
                animated: true,
                hidden: isChildOfCollapsed || isCollapsed
              });
            }
          }
        });
      }

      parentId = nodeId;
    });
  });

  // Add schema nodes
  const mockSchemas = getMockSchemas();
  Object.keys(mockSchemas).forEach((schemaName) => {
    nodes.push(createSchemaNode(schemaName));
  });

  return getLayoutedElements(nodes, edges, direction);
};
