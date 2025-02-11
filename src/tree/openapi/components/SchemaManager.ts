import { Node, Edge } from '@xyflow/react';
import { createSchemaNode } from './Schemas';

export function getSchemas(nodes: Node[]) {
  const schemas: { [key: string]: any } = {};
  nodes.forEach(node => {
    if (node.type === 'default' && node.data.schema) {
      const schemaName = (node.data.schema as { title?: string }).title || `Schema_${node.id}`;
      schemas[schemaName] = node.data.schema;
    }
  });
  return schemas;
}

export function createSchemaNodes(
  schemas: { [key: string]: any },
  rfInstance: any
): { nodes: Node[], edges: Edge[] } {
  const schemaNodes: Node[] = [];
  const schemaEdges: Edge[] = [];

  Object.entries(schemas).forEach(([name, schema]) => {
    const nodeId = `schema-${Date.now()}-${name}`;
    const schemaWithTitle = {
      ...schema,
      title: name
    };
    const { nodes, edges } = createSchemaNode(
      schemaWithTitle,
      nodeId,
      rfInstance
    );
    schemaNodes.push(...nodes);
    schemaEdges.push(...edges);
  });

  return {
    nodes: schemaNodes,
    edges: schemaEdges
  };
} 