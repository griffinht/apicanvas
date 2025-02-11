import React from 'react';
import { ReactFlowInstance, Node, Edge } from '@xyflow/react';
import { SchemaEditor } from './SchemaEditor';
import { Trash2 } from 'lucide-react';
import './SchemaNode.css';

export interface SchemasProps {
  rfInstance: ReactFlowInstance;
  direction: 'TB' | 'LR';
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
    className: 'schema-node-wrapper'
  };

  return {
    nodes: [schemaNode],
    edges: []
  };
}

export function addSchemaNode(
  parentId: string,
  rfInstance: ReactFlowInstance,
  direction: 'TB' | 'LR'
) {
  const newSchema = {
    type: 'object',
    properties: {},
    xml: {
      name: ''
    }
  };

  const nodeId = `schema-${Date.now()}`;
  const { nodes: newNodes, edges: newEdges } = createSchemaNode(
    newSchema,
    nodeId,
    rfInstance
  );

  const newEdge = {
    id: `${parentId}-${nodeId}`,
    source: parentId,
    target: nodeId,
    type: 'smoothstep'
  };

  rfInstance.setNodes(nodes => [...nodes, ...newNodes]);
  rfInstance.setEdges(edges => [...edges, ...newEdges, newEdge]);
}

export function getSchemaNodeStyle(schema: any) {
  return {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px'
  };
}

export function Schemas({ rfInstance, direction }: SchemasProps) {
  const handleAddSchema = () => {
    const newSchema = {
      type: 'object',
      properties: {},
      xml: {
        name: ''
      }
    };

    const nodeId = `schema-${Date.now()}`;
    const { nodes: newNodes, edges: newEdges } = createSchemaNode(
      newSchema,
      nodeId,
      rfInstance
    );

    rfInstance.setNodes(nodes => [...nodes, ...newNodes]);
    rfInstance.setEdges(edges => [...edges, ...newEdges]);
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
