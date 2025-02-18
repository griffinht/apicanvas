import React from 'react';
import { ReactFlowInstance, Node, Edge, Position } from '@xyflow/react';
import { SchemaEditor } from './SchemaEditor';
import { Trash2 } from 'lucide-react';
import './SchemaNode.css';

export interface SchemasProps {
  rfInstance: ReactFlowInstance;
}

function SchemaNodeContent({
  schema,
  rfInstance,
  nodeId
}: {
  schema: any;
  rfInstance: ReactFlowInstance;
  nodeId: string;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleSchemaChange = (newSchema: any) => {
    rfInstance.setNodes(nodes => nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            schema: newSchema,
            label: <SchemaNodeContent
              schema={newSchema}
              rfInstance={rfInstance}
              nodeId={nodeId}
            />
          }
        };
      }
      return node;
    }));
  };

  const handleDelete = () => {
    rfInstance.setNodes(nodes => nodes.filter(node => node.id !== nodeId));
    rfInstance.setEdges(edges => edges.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
  };

  return (
    <div onClick={e => e.stopPropagation()}>
      <div className="schema-node-header">
        <div className="schema-node-title">
          {schema.title || 'Schema'}
        </div>
        <div className="schema-node-controls">
          <button
            className="schema-node-button"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <button
            className="schema-node-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            ✏️
          </button>
          <button
            className="schema-node-button delete"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <SchemaEditor
          schema={schema}
          onSchemaChange={handleSchemaChange}
          rfInstance={rfInstance}
        />
      ) : isExpanded ? (
        <div className="schema-node-content">
          {JSON.stringify(schema, null, 2)}
        </div>
      ) : (
        <div className="schema-node-summary">
          {Object.keys(schema.properties || {}).length} properties
        </div>
      )}
    </div>
  );
}

export function createSchemaNode(
  schema: any,
  nodeId: string,
  rfInstance: ReactFlowInstance,
  isHidden: boolean = false
): { nodes: Node[], edges: Edge[] } {
  const schemaNode: Node = {
    id: nodeId,
    type: 'default',
    data: {
      schema,
      label: <SchemaNodeContent
        schema={schema}
        rfInstance={rfInstance}
        nodeId={nodeId}
      />
    },
    position: { x: 0, y: 0 },
    hidden: isHidden,
    style: {
      background: '#ffffff',
      border: '2px solid #4299e1',
      borderRadius: '8px',
      padding: '12px',
      minWidth: '250px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    className: 'schema-node-wrapper',
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  };

  return {
    nodes: [schemaNode],
    edges: []
  };
}

export function addSchemaNode(
  rfInstance: ReactFlowInstance
) {
  const newSchema = {
    type: 'object',
    properties: {},
    xml: {
      name: ''
    }
  };

  const nodeId = `schema-${Date.now()}`;
  const { nodes: newNodes } = createSchemaNode(
    newSchema,
    nodeId,
    rfInstance
  );

  // Get current nodes to calculate position
  const currentNodes = rfInstance.getNodes();
  const schemaNodes = currentNodes.filter(node => 
    node.id.startsWith('schema-') || node.id === 'root-schema-node'
  );
  
  // Position the new node below existing schema nodes
  const node = newNodes[0];
  node.position = {
    x: 1500, // Same X position as other schema nodes
    y: (schemaNodes.length) * 100 // Position below existing nodes
  };

  const newEdge = {
    id: `root-schema-node-${nodeId}`,
    source: 'root-schema-node',
    target: nodeId,
    type: 'smoothstep',
    sourceHandle: 'right',
    targetHandle: 'left',
    style: { stroke: '#4299e1' }
  };

  rfInstance.setNodes(nodes => [...nodes, ...newNodes]);
  rfInstance.setEdges(edges => [...edges, newEdge]);
}

export function Schemas({ rfInstance }: SchemasProps) {
  const handleAddSchema = () => {
    // Check if root schema node exists, if not create it
    const nodes = rfInstance.getNodes();
    const rootExists = nodes.some(node => node.id === 'root-schema-node');
    
    if (!rootExists) {
      const rootNode: Node = {
        id: 'root-schema-node',
        type: 'default',
        data: {
          schema: { title: 'Schemas' },
          label: 'Schemas'
        },
        position: { x: 1500, y: 0 },
        style: {
          background: '#4299e1',
          color: 'white',
          border: '2px solid #2b6cb0',
          borderRadius: '8px',
          padding: '12px',
          width: 'fit-content',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
      };
      rfInstance.setNodes(nodes => [...nodes, rootNode]);
    }

    const newSchema = {
      type: 'object',
      properties: {},
      xml: {
        name: ''
      }
    };

    const nodeId = `schema-${Date.now()}`;
    const { nodes: newNodes } = createSchemaNode(
      newSchema,
      nodeId,
      rfInstance
    );

    // Position the new node
    const schemaNodes = nodes.filter(node => 
      node.id.startsWith('schema-') || node.id === 'root-schema-node'
    );
    const node = newNodes[0];
    node.position = {
      x: 1500,
      y: schemaNodes.length * 100
    };

    // Create edge to root node
    const newEdge = {
      id: `root-schema-node-${nodeId}`,
      source: 'root-schema-node',
      target: nodeId,
      type: 'smoothstep',
      sourceHandle: 'right',
      targetHandle: 'left',
      style: { stroke: '#4299e1' }
    };

    rfInstance.setNodes(nodes => [...nodes, ...newNodes]);
    rfInstance.setEdges(edges => [...edges, newEdge]);
  };

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      right: '16px',
      zIndex: 1000
    }}>
      <button
        onClick={handleAddSchema}
        style={{
          backgroundColor: '#4299e1',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: 500,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#3182ce';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#4299e1';
        }}
      >
        <span>+ Add Schema</span>
      </button>
    </div>
  );
}
