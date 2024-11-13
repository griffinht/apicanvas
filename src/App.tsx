import { useCallback, useRef } from 'react';
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

import { initialNodes, nodeTypes } from './nodes';
import { initialEdges, edgeTypes } from './edges';

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_, node) => {
      const newId = `dndnode_${Date.now()}`;
      
      setNodes((nds) => [...nds, {
        id: newId,
        type: 'custom-node',
        position: {
          x: node.position.x + 250,
          y: node.position.y,
        },
        data: { label: `Node ${nds.length}` }
      }]);

      setEdges((eds) => [...eds, {
        id: `edge-${node.id}-${newId}-${Date.now()}`,
        source: node.id,
        target: newId,
      }]);
    },
    [setNodes, setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      fitView
    >
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}
