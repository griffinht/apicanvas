import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import yaml from 'yaml';
import { OpenAPISchema, FlowNode, FlowEdge, LayoutOptions } from '../types/OpenAPITypes';

const layoutOptions: LayoutOptions = {
  nodeWidth: 200,
  nodeHeight: 80,
  rankdir: 'LR',
  ranksep: 200,
  nodesep: 100,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], options: LayoutOptions) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: options.rankdir });

  // Add nodes to dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { 
      width: options.nodeWidth, 
      height: options.nodeHeight 
    });
  });

  // Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Layout the graph
  dagre.layout(dagreGraph);

  // Get the positioned nodes from dagre
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - options.nodeWidth / 2,
        y: nodeWithPosition.y - options.nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const OpenAPIEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const processOpenAPISchema = (schema: OpenAPISchema) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Add root node
    const rootNode: FlowNode = {
      id: 'root',
      type: 'default',
      position: { x: 0, y: 0 }, // Position will be set by dagre
      data: { 
        label: `${schema.info.title} v${schema.info.version}`,
        details: schema.info,
        nodeType: 'root'
      }
    };
    newNodes.push(rootNode);

    // Process paths
    Object.entries(schema.paths).forEach(([path, methods], pathIndex) => {
      const pathNode: FlowNode = {
        id: `path-${pathIndex}`,
        type: 'default',
        position: { x: 0, y: 0 }, // Position will be set by dagre
        data: { 
          label: path,
          nodeType: 'path'
        }
      };
      newNodes.push(pathNode);

      // Connect root to path
      newEdges.push({
        id: `edge-root-${pathIndex}`,
        source: 'root',
        target: `path-${pathIndex}`,
        type: 'smoothstep'
      });

      // Process methods
      Object.entries(methods).forEach(([method, details], methodIndex) => {
        const methodNode: FlowNode = {
          id: `method-${pathIndex}-${methodIndex}`,
          type: 'default',
          position: { x: 0, y: 0 }, // Position will be set by dagre
          data: { 
            label: `${method.toUpperCase()}\n${details.summary || ''}`,
            details: details,
            nodeType: 'method'
          }
        };
        newNodes.push(methodNode);

        // Connect path to method
        newEdges.push({
          id: `edge-${pathIndex}-${methodIndex}`,
          source: `path-${pathIndex}`,
          target: `method-${pathIndex}-${methodIndex}`,
          type: 'smoothstep'
        });
      });
    });

    // Apply layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges,
      layoutOptions
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  };

  const loadSampleSchema = useCallback(async () => {
    const sampleSchema = `
openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: Successful response
    post:
      summary: Create a user
      responses:
        '201':
          description: User created
  /users/{id}:
    get:
      summary: Get user by ID
      responses:
        '200':
          description: Successful response
    delete:
      summary: Delete user
      responses:
        '204':
          description: User deleted
`;
    const parsed = yaml.parse(sampleSchema);
    processOpenAPISchema(parsed);
  }, []);

  useEffect(() => {
    loadSampleSchema();
  }, [loadSampleSchema]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default OpenAPIEditor; 