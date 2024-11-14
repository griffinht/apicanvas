import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { initialNodes, nodeTypes } from './nodes/index';
import { initialEdges, edgeTypes } from './edges';

// Example OpenAPI specification structure
const defaultOpenApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "My New API",
    version: "1.0.0"
  },
  paths: {},
  components: {
    schemas: {}
  }
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const [openApiSpec, setOpenApiSpec] = useState(defaultOpenApiSpec);

  const saveSpec = useCallback(() => {
    console.log('Current OpenAPI Spec:', JSON.stringify(openApiSpec, null, 2));
    alert('OpenAPI spec printed to console');
  }, [openApiSpec]);

  const loadSpec = useCallback(async () => {
    try {
      const response = await fetch('/openapi.json');
      const data = await response.json();
      setOpenApiSpec(data);
      console.log('Loaded OpenAPI Spec:', data);
    } catch (error) {
      console.error('Error loading OpenAPI spec:', error);
    }
  }, []);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', right: '10px', top: '10px', zIndex: 4 }}>
        <span style={{ marginRight: '16px', color: '#666' }}>
          {openApiSpec.info.title} v{openApiSpec.info.version}
        </span>
        <button onClick={saveSpec}>Save Spec</button>
        <button onClick={loadSpec} style={{ marginLeft: '8px' }}>Load Spec</button>
      </div>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
