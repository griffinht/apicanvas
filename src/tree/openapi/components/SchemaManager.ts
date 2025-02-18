import { Node, Edge } from '@xyflow/react';
import { createSchemaNode } from './Schemas';

const ROOT_SCHEMA_NODE_ID = 'root-schema-node';
const SCHEMA_X_POSITION = 1500; // Moved further right
const SCHEMA_Y_SPACING = 100; // Vertical spacing between schema nodes

export function getSchemas(nodes: Node[]) {
  const schemas: { [key: string]: any } = {};
  nodes.forEach(node => {
    if (node.type === 'default' && node.data.schema && node.id !== ROOT_SCHEMA_NODE_ID) {
      const schemaName = (node.data.schema as { title?: string }).title || `Schema_${node.id}`;
      schemas[schemaName] = node.data.schema;
    }
  });
  return schemas;
}

function createRootSchemaNode(rfInstance: any): Node {
  return {
    id: ROOT_SCHEMA_NODE_ID,
    type: 'default',
    data: {
      schema: { title: 'Schemas' },
      label: 'Schemas'
    },
    position: { x: SCHEMA_X_POSITION, y: 0 },
    style: {
      background: '#4299e1',
      color: 'white',
      border: '2px solid #2b6cb0',
      borderRadius: '8px',
      padding: '12px',
      width: 'fit-content',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }
  };
}

export function createSchemaNodes(
  schemas: { [key: string]: any },
  rfInstance: any
): { nodes: Node[], edges: Edge[] } {
  const schemaNodes: Node[] = [createRootSchemaNode(rfInstance)];
  const schemaEdges: Edge[] = [];

  Object.entries(schemas).forEach(([name, schema], index) => {
    const nodeId = `schema-${Date.now()}-${name}`;
    const schemaWithTitle = {
      ...schema,
      title: name
    };
    
    const { nodes: newNodes } = createSchemaNode(
      schemaWithTitle,
      nodeId,
      rfInstance
    );

    // Position the node to the right and below the root node
    const node = newNodes[0];
    node.position = {
      x: SCHEMA_X_POSITION,
      y: (index + 1) * SCHEMA_Y_SPACING
    };
    
    schemaNodes.push(node);

    // Connect to root schema node with side handles
    schemaEdges.push({
      id: `${ROOT_SCHEMA_NODE_ID}-${nodeId}`,
      source: ROOT_SCHEMA_NODE_ID,
      target: nodeId,
      type: 'smoothstep',
      sourceHandle: 'right',
      targetHandle: 'left',
      style: { stroke: '#4299e1' }
    });
  });

  return {
    nodes: schemaNodes,
    edges: schemaEdges
  };
} 