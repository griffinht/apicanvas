import { ReactFlowInstance } from '@xyflow/react';
import { getLayoutedElements } from './tree/Layout';
import { createMethodNode } from './tree/openapi/paths/request_methods/RequestMethod';
import { createPathNode } from './tree/openapi/paths/Path';
import { createResponseNode } from './tree/openapi/paths/request_methods/responses/response/ResponseCode';

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
        Object.entries(pathItem).forEach(([key, value]: [string, any]) => {
          if (['get', 'post', 'put', 'delete', 'patch'].includes(key)) {
            const methodNodeId = `${nodeId}-${key}`;
            const { nodes: methodNodes, edges: methodEdges } = createMethodNode(
              key,
              methodNodeId,
              rfInstance,
              direction,
              isChildOfCollapsed || isCollapsed,
              nodeId,
              value.summary
            );
            
            nodes.push(...methodNodes);

            edges.push({
              id: `e-${nodeId}-${methodNodeId}`,
              source: nodeId,
              target: methodNodeId,
              type: 'smoothstep',
              animated: true,
              hidden: isChildOfCollapsed || isCollapsed
            });

            // Add response nodes for each status code
            if (value.responses) {
              Object.entries(value.responses).forEach(([statusCode, response]: [string, any]) => {
                const responseNodeId = `${methodNodeId}-${statusCode}`;

                let schema = undefined
                let contentt = undefined
                // Log if we find a schema reference
                if (response.content) {
                  const [contentType, content] = Object.entries(response.content)[0];
                  
                  // Helper function to handle schema references
                  const handleSchemaRef = (schemaRef: string, responseNodeId: string) => {
                    console.log(`Found schema reference in response node ${responseNodeId}:`, schemaRef);
                    
                    // Extract schema name from reference (e.g., "User" from "#/components/schemas/User")
                    const schemaName = schemaRef.split('/').pop();
                    const schemaNodeId = `schema-${schemaName}`;
                    
                    // Check if schema node exists
                    const existingSchemaNode = nodes.find(n => n.id === schemaNodeId);
                    
                    if (!existingSchemaNode) {
                      // Create new schema node if it doesn't exist
                      nodes.push({
                        id: schemaNodeId,
                        type: 'default',
                        data: {
                          schema: { title: schemaName },
                          label: schemaName
                        },
                        position: { x: 1500, y: nodes.length * 100 },
                        style: {
                          background: '#ffffff',
                          border: '2px solid #4299e1',
                          borderRadius: '8px',
                          padding: '12px',
                          minWidth: '250px',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }
                      });
                    }
                    
                    // Create edge from response node to schema node
                    edges.push({
                      id: `e-${responseNodeId}-${schemaNodeId}`,
                      source: responseNodeId,
                      target: schemaNodeId,
                      type: 'smoothstep',
                      animated: true,
                      style: { stroke: '#4299e1' },
                    });
                  };

                  // Handle direct schema reference
                  // @ts-ignore
                  if (content.schema?.$ref) {
                    handleSchemaRef(content.schema.$ref, responseNodeId);
                  }

                  schema = Object.values(response.content)[0].schema
                  if (schema.type === 'array') {
                    // @ts-ignore
                    if (schema.items?.$ref) {
                      handleSchemaRef(schema.items.$ref, responseNodeId);
                    }
                  }
                  contentt = Object.keys(response.content)[0]
                }

                // @ts-ignore
                const { nodes: responseNodes, edges: responseEdges } = createResponseNode(
                  statusCode,
                  response.description,
                  responseNodeId,
                  rfInstance,
                  isChildOfCollapsed || isCollapsed,
                  // @ts-ignore
                  schema,
                  contentt
                );

                nodes.push(...responseNodes);
                edges.push({
                  id: `e-${methodNodeId}-${responseNodeId}`,
                  source: methodNodeId,
                  target: responseNodeId,
                  type: 'smoothstep',
                  animated: true,
                  hidden: isChildOfCollapsed || isCollapsed
                });

                // Add schema and content type if present
                if (response.content) {
                  const [contentType, content] = Object.entries(response.content)[0];
                  responseNodes[0].data = {
                    ...responseNodes[0].data,
                    // @ts-ignore
                    schema: content.schema,
                    contentType
                  };
                }
              });
            }

            // Add the method edges
            edges.push(...methodEdges);
          }
        });
      }

      parentId = nodeId;
    });
  });

  return getLayoutedElements(nodes, edges, direction);
};
